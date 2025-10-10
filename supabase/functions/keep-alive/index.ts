import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`[${new Date().toISOString()}] Keep-alive function executed`)

    // Query menu_data table to keep database active
    const { data, error } = await supabase
      .from('menu_data')
      .select('id')
      .limit(1)

    if (error) {
      console.error(`[${new Date().toISOString()}] Error querying database:`, error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`[${new Date().toISOString()}] Database query successful, rows returned:`, data?.length || 0)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database is active',
        timestamp: new Date().toISOString(),
        rows: data?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Unexpected error:`, error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

