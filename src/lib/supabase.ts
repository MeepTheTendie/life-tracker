import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vihmrwjkxuubvjkztiwe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaG1yd2preHV1YnZqa3p0aXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Mjg3MzUsImV4cCI6MjA4NjAwNDczNX0.vQAW0ETlq7hddbpxx3827R_DT2BfQ53B3BpR2CmFxmk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getLocalUserId(): string {
	if (typeof window === 'undefined') return '';
	
	let userId = localStorage.getItem('life_tracker_user_id');
	if (!userId) {
		userId = 'user_' + Math.random().toString(36).substring(2, 15);
		localStorage.setItem('life_tracker_user_id', userId);
	}
	return userId;
}
