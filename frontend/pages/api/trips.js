const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

//https://www.section.io/engineering-education/build-nextjs-with-mongodb-and-deploy-on-vercel/


async function getPosts(req,res){
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts
        let trips = await db
            .collection('trips')
            .find({})
            .sort({})
            .toArray();
        // return the posts
        return res.json({
            message: JSON.parse(JSON.stringify(trips)),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function addPost(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // add the post
        let outcome = await db.collection('trips').insertOne(JSON.parse(req.body));
        // return a message
        return res.json({
            message: 'Post added successfully',
            success: true,
            id: outcome.insertedId
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function updatePost(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();

        // update the published status of the post
        await db.collection('trips').updateOne(
            {
                _id: new ObjectId(req.body),
            },
            { $set: { published: true } }
        );

        // return a message
        return res.json({
            message: 'Post updated successfully',
            success: true,
        });
    } catch (error) {

        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function getById(req,res){
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts
        let trip = await db
            .collection('trips')
            .find({_id: ObjectId(req.body)})
            .sort({})
            .toArray();
        // return the posts
        return res.json({
            message: JSON.parse(JSON.stringify(trip)),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getPosts(req, res);
        }

        case 'POST': {
            return addPost(req, res);
        }

        case 'PUT': {
            return updatePost(req, res);
        }

        case 'DELETE': {
            return deletePost(req, res);
        }
        
        case 'FILTERID' : {
            return getById(req, res);

        }
    }
}