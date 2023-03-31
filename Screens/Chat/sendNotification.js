const sendNotification = (data) => {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : 'key=AAAA0zFNLlI:APA91bHxChCEqdDMsJRNd96WKZIhBOLwUCMZpp3FJyie7ZxVQD19BdZ-Nd65fwdM78miXbH1_O-RW7mpct2x79MY98H4sSwq22o2c0I9AkVBrTpHzInjghcjXcnw2M4M0S5BC3bXjv7w'})
    const notificationData = JSON.stringify({
        data: {
            ...data
        },
        priority: 'high',
        to: data.token
    })

    const reqOptions = {
        method: 'POST',
        headers: headers,
        body: notificationData,
        redirect: 'follow'
    }

    fetch('https://fcm.googleapis.com/fcm/send', reqOptions).then(res => res.text()).then(result => console.log(result)).catch(err => console.error(err))
}

export default {
    sendNotification
}

/* 
Success response structure
{
    "multicast_id": 3462871451363966782,
    "success": 1,
    "failure": 0,
    "canonical_ids": 0,
    "results": [
        {
            "message_id": "0:1679589080872167%b9e55816b9e55816"
        }
    ]
}

*/