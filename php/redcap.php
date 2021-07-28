<?php

require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

/**
 * Class to handle interactions with the REDCap API, including utility functions
 * specific to the timeline-followback application.
 */
class REDCapAPI {
    private $client;
    private $token;

    /**
     * Initialize an interface to REDCap for a project.
     * 
     * @param string $uri The URI of the REDCap API for all requests.
     * @param string $token the API token associated with a REDCap project.
     */
    function __construct($uri, $token) {
        $this->client = new Client(['base_uri' => $uri]);
        $this->token = $token;
    }

    /**
     * Make a generic API request with default parameters.
     * 
     * @param string $content The desired REDCap content type.
     * @param array $params Additional parameters to send with the request. Can override the defaults.
     */
    function request($content, $params = []) {
        $response = $this->client->post('', [
            'form_params' => array_replace([
                'token' => $this->token,
                'content' => $content,
                'format' => 'json',
                'returnFormat' => 'json'
            ], $params)
        ]);
    
        $body = json_decode($response->getBody());
    
        return $body;
    }
    
    /**
     * Verify that a participant exists in the REDCap database.
     * 
     * @param string $sid The study ID of the participant.
     * @param string $dob The participant's date of birth in YYYY-MM-DD format.
     */
    function verify_patient($sid, $dob) {
        $body = $this->request('record', [
            'fields' => ['dob'],
            'filterLogic' => '[visitstart_studyid]=\''.$sid.'\' and [dob]=\''.$dob.'\''
        ]);
    
        if (count($body) > 0)
            return TRUE;
    
        return FALSE;
    }

    /**
     * Verify that a form has been marked complete in the REDCap database.
     * 
     * @param string $sid The study ID of the participant.
     * @param string $evt The REDCap event with which the record is associated.
     * @param string $frm The REDCap instrument to check against.
     * @param string $flt A REDCap filter string.
     */
    function verify_form_complete($sid, $evt, $frm, $flt) {
        $body = $this->request('record', [
            'events' => [$evt],
            'forms' => [$frm],
            'filterLogic' => '[visitstart_studyid]=\''.$sid.'\''.($flt ? ' and '.$flt : '')
        ]);
        
        // If a record is found, verify that the form is complete.
        if (count($body) > 0 and $body[0]->{$frm.'_complete'})
            return TRUE;
    
        return FALSE;
    }

}

?>