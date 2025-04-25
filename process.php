<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); 
ini_set('log_errors', 1);
ini_set('error_log', dirname(__FILE__) . '/error.log');

session_start();
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $destination = $input['destination'] ?? "";
    $startDate = $input['startDate'] ?? "";
    $endDate = $input['endDate'] ?? "";
    $travelers = $input['travelers'] ?? "1";
    $tripType = $input['tripType'] ?? "solo";
    $budget = $input['budget'] ?? "not specified";
    $interests = isset($input['interests']) ? implode(", ", $input['interests']) : "general sightseeing";
    $pace = $input['pace'] ?? "3";
    $specialRequests = $input['specialRequests'] ?? "";


    if ($destination && $startDate && $endDate && $startDate <= $endDate) {
        $prompt = "Generate a personalized, detailed, and budget-friendly travel package with all costs in Indian Rupees (₹).\n\n" .
                  "Destination: $destination\n" .
                  "Dates: $startDate to $endDate\n" .
                  "Travelers: $travelers\n" .
                  "Trip Type: $tripType\n" .
                  "Budget: ₹$budget\n" .
                  "Interests: $interests\n" .
                  "Pace: $pace\n" .
                  "Special Requests: $specialRequests\n\n" .
                  "Include:\n\n" .
                  "🏨 Accommodation\n" .
                  "🚇 Transport\n" .
                  "🍽️ Meals\n" .
                  "🎡 Attractions\n" .
                  "📅 Day-by-day itinerary\n" .
                  "📱 SIM card/internet suggestions\n\n" .
                  "Format clearly with emojis and bold section headers.";

        $apiKey = "AIzaSyCRHpoA9vH7oHQYIrETs4ccCtqp18InSJE"; // Replace with your real Gemini API key from Google AI Studio
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . urlencode($apiKey);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["contents" => [["parts" => [["text" => $prompt]]]]]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FAILONERROR, false);
        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $response = curl_exec($ch);
        if ($response === false) {
            $error = curl_error($ch);
            echo json_encode(['success' => false, 'error' => 'cURL Error: ' . $error]);
        } else {
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($httpCode != 200) {
                echo json_encode(['success' => false, 'error' => 'HTTP Error: ' . $httpCode . ' - ' . $response]);
            } else {
                $result = json_decode($response, true);
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $plan = $result['candidates'][0]['content']['parts'][0]['text'];
                    $_SESSION['tripPlan'] = $plan;
                    echo json_encode(['success' => true, 'plan' => $plan]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'API Error: ' . ($response ?: 'No response')]);
                }
            }
        }
        curl_close($ch); 
    } else {
        echo json_encode(['success' => false, 'error' => 'Please fill all fields with valid dates (start date must be before end date).']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>