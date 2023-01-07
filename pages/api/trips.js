import clientPromise from "../../lib/mongodb";

export default async function(req, res){
    try {
        const client = await clientPromise;
        const db = client.db("tripplanner");

        const trips = await db
            .collection("trips")
            .find({})
            .sort({})
            .limit(10)
            .toArray();

        res.json(trips);
    } catch (e) {
        console.error(e);
    }
}