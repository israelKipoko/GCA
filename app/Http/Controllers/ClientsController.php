<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientsController extends Controller
{
    public function edit(Request $request){
          // Validate the request
        $validated = $request->validate([
            'id' => 'required|integer|exists:clients,id',
            'field' => 'required|string|in:name,sector,contacts', // whitelist editable fields
            'value' => 'required|string|max:255'
        ]);

         // Find and update the group
        $client = Client::findOrFail($validated['id']);

        $field = $validated['field'];
        $client->$field = strip_tags($validated['value']); // additional sanitization
        $client->save();

         return response()->json([],201);
    }

    public function updateLogo(Request $request){
        $request->validate([
            'logo' => 'required',
            'id' => 'required|exists:clients,id',
        ]);

        $client = Client::findOrFail($request->id);

        // Remove previous logo if it exists
        $client->clearMediaCollection('logos');

        // Add the new one
        $client->addMedia( $request->file('logo'))->toMediaCollection('logos',"logos");

        return response()->json(['message' => 'Logo updated successfully']);
    }
}
