import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const path = searchParams.get('path') || '/';

	revalidatePath(path);
	console.log('Revalidated path:', path);

	return NextResponse.json({
		revalidated: true,
		path: path
	});
}
