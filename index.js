
const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    // TODO implement

    var medialive = new AWS.MediaLive();

    console.log("body " + JSON.stringify(event));

    var resource = event.resource;

    if (resource == "/get-status") {


        var channelJsonObj = JSON.parse(event.queryStringParameters.data);

        var channelId = channelJsonObj.channelId;

        console.log("channelId " + channelId);

        var channelStatus = "";

        var params = {
            ChannelId: channelId /* required */
        };

        medialive.describeChannel(params).promise().then(function (data) {
            console.log(JSON.stringify(data));           // successful response

            channelStatus = data.State;

        }).then(function () {

            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(channelStatus)
            };
            callback(null, response);
        });

    }

    if (resource == "/start-channel") {
        var body = JSON.parse(event.body);

        console.log("body " + JSON.stringify(body));

        var channelId = body.channelId;
        console.log("channelId " + channelId)

        var params = {
            ChannelId: channelId /* required */
        };

        medialive.startChannel(params).promise().then(function (data) {

            console.log(data);

        }).then(function () {

            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify('Starting the channel.. !')
            };

            console.log("inside channel start service.. ")
            callback(null, response);
        });

    }

    if (resource == "/stop-channel") {

        var body = JSON.parse(event.body);

        console.log("body " + JSON.stringify(body));

        var channelId = body.channelId;
        console.log("channelId " + channelId)

        var params = {
            ChannelId: channelId /* required */
        };
        medialive.stopChannel(params).promise().then(function (data) {

            console.log(data);           // successful response

        }).then(function () {

            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify('Stopping Channel Service.. !')
            };

            console.log("inside channel stop service.. ")

            callback(null, response);
        });

    }

    if (resource == "/channel-list") {

        var dataObj2 = {};
        var dataArray3 = [];

        var params = {
            MaxResults: 10,
            //NextToken: 'STRING_VALUE'
        };

        var dataArray = [];

        medialive.listChannels(params).promise().then(function (data) {

            console.log(data);           // successful response

            data.Channels.forEach(function (itemData) {

                var dataObj3 = {};

                dataObj3.chId = itemData.Id;
                dataObj3.chName = itemData.Name;

                dataArray3.push(dataObj3);

            })

        }).then(function () {

            console.log("dataArray3 " + JSON.stringify(dataArray3));

            dataObj2.Channels = dataArray3;

            var response = {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": JSON.stringify(dataObj2)
            };

            callback(null, response);
        });
    }

}