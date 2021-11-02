const TipsModel = require('./../../models/tips');

class Tips {
    static async getTips(req, res) {
        const queryParams = req.query;
        if (!queryParams) {
            const tipsData = await TipsModel.find().lean();
            if (!tipsData.length) {
                return res.status(400).send({
                    message: 'No data found.'
                });
            } else {
                const respObjArr = [];
                for (const tip of tipsData) {
                    const tipObj = {
                        "spendAt": tip.place,
                        "totalAmount": tip.totalAmount,
                        "tipPercentage": tip.tipPercentage
                    };
                    respObjArr.push(tipObj);
                }
                return res.status(200).send(respObjArr);
            }
        } else if (queryParams && queryParams.analyticsType === 'tipPercentage') {
            // const startDate = new Date(queryParams.startDate.split("-").reverse().join("-")).toISOString();
            // const endDate = new Date(queryParams.endDate.split("-").reverse().join("-")).toISOString();
            const tipsData = await TipsModel.aggregate([
                {"$group" : { "_id": "$tipPercentage", "noOftimes": {"$sum": 1}, "count" : { "$sum": 1 } } },
                {"$match": 
                    {
                        "_id" :{ "$ne" : null } ,
                         "count" : {"$gt": 1},
                        //  "createdAt" : {"$gte": startDate, "$lte": endDate}
                    } 
                }, 
                {"$project": {"tipPercentage" : "$_id", "noOftimes":"$noOftimes", "_id" : 0} }
            ]);
            if (tipsData.length) {
                return res.status(200).send({
                    tipPercentage: tipsData[0].tipPercentage,
                    noOftimes: tipsData[0].noOftimes
                });
            } else {
                return res.status(200).send({
                    tipPercentage: 0,
                    noOftimes: 0
                });
            }
        } else if (queryParams && queryParams.analyticsType === 'mostVisited') {
            // const startDate = new Date(queryParams.startDate.split("-").reverse().join("-")).toISOString();
            // const endDate = new Date(queryParams.endDate.split("-").reverse().join("-")).toISOString();
            const tipsData = await TipsModel.aggregate([
                {"$group" : { "_id": "$place", "noOftimes": {"$sum": 1}, "count" : { "$sum": 1 } } },
                {"$match": 
                    {
                        "_id" : { "$ne" : null } , 
                        "count" : {"$gt": 1},
                        // "createdAt" : {"$gte": startDate, "$lte": endDate}
                    } 
                }, 
                {"$project": {"place" : "$_id", "noOftimes":"$noOftimes", "_id" : 0} }
            ]);
            if (tipsData.length) {
                return res.status(200).send({
                    place: tipsData[0].place,
                    noOftimes: tipsData[0].noOftimes
                });
            } else {
                return res.status(200).send({
                    place: "",
                    noOftimes: 0
                });
            }
        }
    }

    static async calculateTips(req, res) {
        const tipBody = req.body;
        const tipData = await new TipsModel(tipBody);
        try {
            tipData.save();
        } catch (error) {
            return res.status(400).send({
                message: 'Something went wrong while adding tip.'
            });
        }
        const tip = parseInt((tipBody.totalAmount * tipBody.tipPercentage) / 100);
        return res.status(200).send({tip});
    }
}

module.exports = Tips;