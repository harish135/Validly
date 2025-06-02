// Only showing the relevant changes for brevity
const [userUsage, setUserUsage] = useState<{ triesLeft: number | 'Unlimited' | null }>({ triesLeft: null });

useEffect(() => {
  let mounted = true;
  const fetchUserUsage = async () => {
    if (appUser && mounted) {
      console.log('App: Fetching user usage for appUser ID:', appUser.id);
      try {
        const { data, error } = await supabase.rpc('get_user_plan_and_usage', { p_user_id: appUser.id });
        if (!mounted) { console.log("App: fetchUserUsage, but unmounted before setting state."); return; }
        console.log('App: Fetched user plan/usage RPC result:', { data, error });
        if (error) {
          console.error('App: Error fetching user usage:', error);
          setUserUsage({ triesLeft: null });
          return;
        }
        if (data && data.length > 0) {
          const usage = data[0];
          const newTriesLeft = usage.is_unlimited ? 'Unlimited' : usage.requests_remaining;
          console.log('App: Setting triesLeft (from fetchUserUsage):', newTriesLeft);
          setUserUsage({ triesLeft: newTriesLeft });
        } else {
          console.warn('App: No usage data returned for user from RPC.');
          setUserUsage({ triesLeft: null });
        }
      } catch(rpcError) {
        console.error('App: Exception during fetchUserUsage RPC call:', rpcError);
        if (mounted) setUserUsage({ triesLeft: null });
      }
    } else if (!appUser) {
      console.log('App: No appUser, clearing userUsage and not fetching.');
      setUserUsage({ triesLeft: null });
    }
  };
  fetchUserUsage();
  return () => { mounted = false; }
}, [appUser]);

export default userUsage