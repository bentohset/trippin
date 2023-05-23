
//https://www.section.io/engineering-education/build-nextjs-with-mongodb-and-deploy-on-vercel/

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET': {
            console.log('get')
            return handleGet(req, res)
        }

        case 'POST': {
            return createTrip(req, res)
        }

        case 'PATCH': {
            return updateTrip(req, res)
        }

        case 'DELETE': {
            return deleteTrip(req, res)
        }

        default: {
            return res.status(400).json({ message: 'invalid route' })
        }
    }
}

async function handleGet(req, res) {
    const { tripId } = req.query

    if (tripId) {
        return getTripById(req, res, tripId)
    } else {
        return getAllTrips(req, res)
    }
}

async function getAllTrips(req, res) {
    try {
        let dev = process.env.NODE_ENV !== 'production';
        let { DEV_API_URL, PROD_API_URL} = process.env;

        const url = `${dev ? DEV_API_URL : PROD_API_URL}/trips`

        const response = await fetch(url)
        const data = await response.json();
        console.log(data)

        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error})
    }
}

async function getTripById(req, res, tripId) {
    try {
        let dev = process.env.NODE_ENV !== 'production';
        let { DEV_API_URL, PROD_API_URL} = process.env;

        const url = `${dev ? DEV_API_URL : PROD_API_URL}/trips/${tripId}`
        const response = await fetch(url)
        const data = await response.json();
        console.log(data)
        if (response.status === 404) {
            res.status(404).json({ error: 'trip not found' })
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
}

async function createTrip(req, res) {
    try {
        let dev = process.env.NODE_ENV !== 'production';
        let { DEV_API_URL, PROD_API_URL} = process.env;

        const url = `${dev ? DEV_API_URL : PROD_API_URL}/trips`

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log(data)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'server error' })
    }
}

async function updateTrip(req, res) {
    const { query } = req;
    const { tripId } = query;
    try {
        let dev = process.env.NODE_ENV !== 'production';
        let { DEV_API_URL, PROD_API_URL} = process.env;

        const url = `${dev ? DEV_API_URL : PROD_API_URL}/trips/${tripId}`

        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        console.log(data)
        res.status(200).json(data)
    } catch (error) {

        res.status(500).json({ error: 'server error' })
    }
}

async function deleteTrip(req, res) {
    const { query } = req;
    const { tripId } = query;
    try {
        let dev = process.env.NODE_ENV !== 'production';
        let { DEV_API_URL, PROD_API_URL} = process.env;

        const url = `${dev ? DEV_API_URL : PROD_API_URL}/trips/${tripId}`

        const response = await fetch(url, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data)
        res.status(200).end()
        
    } catch (error) {

        res.status(500).json({ error: 'server error' })
    }
}