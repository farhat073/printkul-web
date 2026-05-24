const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; // If RLS allows, otherwise we need service key

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Let's just set is_active to false for existing banners
  const { data, error } = await supabase
    .from('banners')
    .update({ is_active: false })
    .eq('position', 'home_hero');
    
  console.log(data, error);
}

run();
