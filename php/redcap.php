<?php

require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

/**
 * Class to handle interactions with the REDCap API, including utility functions
 * specific to the timeline follow-back application.
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
     * Fetch the list of events in which an instrument is administered.
     * 
     * @param string $arm The study arm to return.
     * @param string $instrument The insntrument to fetch events for.
     */
    function get_instrument_event_map($arm, $instrument) {
        $body = $this->request('formEventMapping', [
            'arms' => [$arm]
        ]);
    
        if (count($body) < 1)
            return false;
        
        $matching = array_filter($body, function ($item) use ($instrument) {
            return $item->form == $instrument;
        });

        $matching = array_map(function($item) {
            return $item->unique_event_name;
        }, $matching);

        return array_values($matching);
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
     * Verify that a value matches that recorded in the database for a patient.
     * 
     * @param string $record The record ID of the participant.
     * @param string $event The event to check against.
     * @param string $field The name of the field to check.
     * @param string $value The value to check against.
     */
    function verify_field($record, $event, $field, $value) {
        $body = $this->request('record', [
            'records' => [$record],
            'fields' => [$field],
            'events' => [$event],
            'filterLogic' => "[$field]='$value'"
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

    /**
     * Import records to REDCap.
     * 
     * @param string $record The record ID of the participant.
     * @param string $event The REDCap event to import data to.
     * @param array $data  Data to import.
     */
    function import($record, $event, $data = []) {
        $body = $this->request('record', [
            'data' => json_encode([array_replace([
                'record_id' => $record,
                'redcap_event_name' => $event
            ], $data)]),
            'overwriteBehavior' => 'normal',
            'dateFormat' => 'YMD'
        ]);

        return $body;
    }

}

?>