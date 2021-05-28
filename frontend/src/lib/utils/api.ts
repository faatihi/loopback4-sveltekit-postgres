export const base = 'http://localhost:3000';

export async function get (resource: string, data?: {}) {
	return api({ method: 'GET' }, resource);
}

export async function post (resource: string, data?: {}) {
	return api({ method: 'POST' }, resource, data);
}

export async function remove (resource: string, data?: {}) {
	return api({ method: 'DELETE' }, resource, data);
}

export async function patch (resource: string, data?: {}) {
	return api({ method: 'PATCH' }, resource, data);
}

export async function api (request, resource: string, data?: {}) {

	const res = await fetch(`${base}/${resource}`, {
		method: request.method,
		headers: {
			'content-type': 'application/json'
		},
		body: data && JSON.stringify(data)
	});

	return {
		status: res.status,
		data: res.status === 204 ? null : await res.json()
	};
}
