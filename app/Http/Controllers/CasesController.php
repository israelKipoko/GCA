<?php

namespace App\Http\Controllers;

use App\Models\PendingCases;
use Illuminate\Http\Request;

class CasesController extends Controller
{
    public function DeleteMessage(Request $request){
          // Validate the request
        $validated = $request->validate([
            'ID' => 'required|integer|exists:pending_cases,id',
        ]);

         // Find and update the group
        $message = PendingCases::with('media')->findOrFail($validated['ID']);
        $message->delete();

         if($message->hasMedia($message->case_id)){
            $mediaItems = $message->getMedia();
            foreach ($mediaItems as $item) {
                $item->delete();
            }
         }

         return response()->json([],201);
    }

    public function EditMessage(Request $request){
           // Validate the request
        $validated = $request->validate([
            'ID' => 'required|integer|exists:pending_cases,id',
            'editedMessage' => 'required|string',
        ]);

         // Find and update the group
        $message = PendingCases::findOrFail($validated['ID']);
        $message->comments = $validated['editedMessage'];
        $message->save();

        return response()->json([],201);
        
    }
}
