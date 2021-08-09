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
     * Fetch the list of events.
     * 
     * @param string $record The record ID of the participant.
     */
    function get_events() {
        $body = $this->request('event');
    
        if (count($body) < 1)
            return false;
        
        return $body;
    }

    /**
     * Obtain basic patient information.
     * 
     * @param string $record The record ID of the participant.
     * @param string $event The REDCap event associated with the desired fields.
     * @param array $fields The fields to retrieve.
     */
    function get_patient($record, $event, $fields) {
        $body = $this->request('record', [
            'records' => [$record],
            'events' => [$event],
            'fields' => $fields
            
        ]);
    
        if (count($body) < 1)
            return false;
        
        return $body[0];
    }
    
    /**
     * Verify that a participant exists in the REDCap database.
     * 
     * @param string $record The record ID of the participant.
     * @param string $dob The participant's date of birth in YYYY-MM-DD format.
     */
    function verify_patient($record, $dob) {
        $body = $this->request('record', [
            'records' => [$record],
            'fields' => ['dob'],
            'filterLogic' => '[dob]=\''.$dob.'\''
        ]);
    
        if (count($body) > 0)
            return true;
    
        return false;
    }

    /**
     * Verify that a form has been marked complete in the REDCap database.
     * 
     * @param string $record The record ID of the participant.
     * @param string $evt The REDCap event with which the record is associated.
     * @param string $frm The REDCap instrument to check against.
     * @param string $flt A REDCap filter string.
     */
    function verify_form_complete($record, $evt, $frm, $flt = '') {
        $body = $this->request('record', [
            'records' => [$record],
            'events' => [$evt],
            'forms' => [$frm],
            'filterLogic' => $flt
        ]);
        
        // If a record is found, verify that the form is complete.
        if (count($body) > 0 and $body[0]->{$frm.'_complete'})
            return true;
    
        return false;
    }

}

?>