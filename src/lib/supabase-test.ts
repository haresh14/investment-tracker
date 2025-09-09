import { supabase } from './supabase';

/**
 * Test Supabase connection and basic functionality
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data, error } = await supabase.from('sips').select('count');
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test 2: Authentication state
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', session ? 'Active' : 'No session');
    
    return true;
  } catch (err) {
    console.error('❌ Supabase test failed:', err);
    return false;
  }
};

/**
 * Test database operations (requires authentication)
 */
export const testDatabaseOperations = async () => {
  try {
    console.log('🧪 Testing database operations...');
    
    // Test reading SIPs
    const { data: sips, error: sipsError } = await supabase
      .from('sips')
      .select('*');
    
    if (sipsError) {
      console.error('❌ Failed to read SIPs:', sipsError.message);
      return false;
    }
    
    console.log('✅ SIPs table accessible, found', sips?.length || 0, 'records');
    
    // Test reading withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*');
    
    if (withdrawalsError) {
      console.error('❌ Failed to read withdrawals:', withdrawalsError.message);
      return false;
    }
    
    console.log('✅ Withdrawals table accessible, found', withdrawals?.length || 0, 'records');
    
    return true;
  } catch (err) {
    console.error('❌ Database operations test failed:', err);
    return false;
  }
};
