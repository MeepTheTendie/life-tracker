import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zmrnfedkieoaxcnaalqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptcm5mZWRraWVvYXhjbmFhbHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MzI2NTEsImV4cCI6MjA4NjAwODY1MX0.uKw0bSE4YjDw3sL_K1QvsfEwiuMS0srPDVE08qrvFk8';

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
