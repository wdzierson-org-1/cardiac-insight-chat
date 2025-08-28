import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { doctorType } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    let prompt = "";
    if (doctorType === "asha") {
      prompt = "Professional portrait of a female doctor of South Asian ethnicity, wearing a white medical coat with a stethoscope around her neck, warm confident smile, standing in a modern hospital setting, high-quality medical photography, professional lighting, 4K resolution";
    } else if (doctorType === "leah") {
      prompt = "Professional portrait of a Caucasian female doctor with blonde hair, wearing a white medical coat, confident professional expression, different pose from typical medical photos, modern clinical background, high-quality medical photography, professional lighting, 4K resolution";
    } else {
      throw new Error('Invalid doctor type. Use "asha" or "leah"');
    }

    console.log(`Generating image for ${doctorType} with prompt:`, prompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Image generation successful for', doctorType);

    // Note: gpt-image-1 returns base64 data directly
    return new Response(JSON.stringify({
      success: true,
      doctorType: doctorType,
      imageData: data.data[0].b64_json
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-doctor-images function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});