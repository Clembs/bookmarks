import { redirect } from '@sveltejs/kit';

export async function GET({ locals: { getSession } }) {
	const session = await getSession();
	if (session) {
		throw redirect(302, '/app');
	} else {
		throw redirect(302, '/login');
	}
}
