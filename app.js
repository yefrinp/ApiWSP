const WAZIPER = require("./waziper/waziper.js");
const config = require("./config.js");
const Common = require("./waziper/common.js");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

WAZIPER.app.get('/paymentdone', WAZIPER.cors, async (req, res) => {
  const url = 'https://bot.whatsbotpro.com/api/send?number=919983939151&type=text&message=payment+get&instance_id=64CF10B8DD194&access_token=649bebf664a20';

axios.get(url)
  .then(function (response) {
    // Handle the response here
    console.log('Response:', response.data);
  })
  .catch(function (error) {
    // Handle any errors here
    console.error('Error:', error);
  });
});

WAZIPER.app.post('/api/campaign_create', WAZIPER.cors, async (req,res) =>{
    
    console.log(req.body)
    res.send('done')
    
})


// WAZIPER.app.get('/get_accounts', WAZIPER.cors, async (req, res) => {
//   try {
//     // Step 1: Fetch all accounts from sp_accounts table
//     const query = "SELECT id, username, name FROM sp_accounts";
//     const accounts = await Common.db_query(query, false); // Pass false to get all rows
    
//     // Step 2: Fetch all sessions from sp_whatsapp_sessions table
//     const query2 = "SELECT data, status FROM sp_whatsapp_sessions";
//     const sessions = await Common.db_query(query2, false); // Pass false to get all rows
    
//     // Step 3: Iterate through accounts and check if username exists in active sessions
//     const updatedAccounts = accounts.map(account => {
//       const isActive = sessions.some(session => {
//         if (session.status === 1 && session.data) {
//           const sessionData = JSON.parse(session.data);
//           const sessionNumber = sessionData.id.split(':')[0]; // Extract the number part before ':'
//           return sessionNumber === account.username;
//         }
//         return false;
//       });
      
//       // Set active status based on isActive flag
//       return {
//         ...account,
//         active: isActive
//       };
//     });
    
// const webhookUrl = 'https://webhook.site/58a94e2a-7d60-4661-bfd2-92d2ad58db76'; // Replace with your actual webhook URL
//     await axios.post(webhookUrl, { data: updatedAccounts });
    
    
//     // Step 4: Send the response with updated accounts data including active status
//     return res.json({ status: 'success',  });
//   } catch (error) {
//     console.error('Error fetching accounts:', error);
//     return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });



// WAZIPER.app.post('/api/create_contact', WAZIPER.cors, async (req, res) => {
//   try {
//     const { name , access_token, phone} = req.body;
// console.log(req.body)
//     if (!name) {
//       return res.status(400).json({ status: 'error', message: 'Name is required' });
//     }
    

  
  

//     const query = "SELECT * FROM sp_team";
//     const teamData = await Common.db_query(query, false);

// if (teamData.length === 0) {
//       return res.status(404).json({ status: 'error', message: 'Team data not found' });
//     }
    
//      const matchedObject = teamData.find(obj => obj.ids === access_token);

//     if (!matchedObject) {
//       return res.status(404).json({ status: 'error', message: 'Team data not found' });
//     }
    


// const team_id = matchedObject.owner; // Replace with your actual team_id data
// const status = 1;
// const changed = Math.floor(Date.now() / 1000);
// const created = Math.floor(Date.now() / 1000);
// const ids = Common.makeid(13) // Generate a UUID for ids

// const insertParams = {ids, team_id, name, status, changed, created}

//  const insertResult = await Common.db_insert("sp_whatsapp_contacts", insertParams);

//     if(!insertResult){
//     return res.status(500).json({ status: 'error', message: 'Contact Create Failed' });

//     }
    
//     const phone_data = {
//         ids:Common.makeid(13),
//         team_id,
//         pid:insertResult.insertId,
//         phone
//     }
    

// console.log('Inserting into sp_whatsapp_phone_numbers...',phone_data);
// const phoneResult = await Common.db_insert("sp_whatsapp_phone_numbers", phone_data);
// console.log('Phone result:', phoneResult);
    

//     return res.status(201).json({ status: 'success', message:  phoneResult});

//   } catch (error) {
//     console.error('Error creating contact:', error);
//     return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });




WAZIPER.app.get('/api/get_accounts', WAZIPER.cors, async (req, res) => {
   
   try {
    const { access_token } = req.query;

    if (!access_token ) {
      return res.status(400).json({ status: 'error', message: 'All fields is required' });
    }

        const teamData = await Common.db_fetch("sp_team", [{ids : access_token}]);
    

    if (teamData.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Team data not found' });
    }



    const team_id = teamData[0].owner; // Replace with your actual team_id data
   
   

    const accounts = await Common.db_fetch("sp_accounts", [{team_id : team_id}]);


    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No accounts found for the team' });
    }
    


    return res.status(200).json({ status: 'success', accounts });


  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
   
   
});





WAZIPER.app.post('/api/create_contact', WAZIPER.cors, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { access_token } = req.query;

    if (!name || !access_token || !phone) {
      return res.status(400).json({ status: 'error', message: 'All fields is required' });
    }

     const teamData = await Common.db_fetch("sp_team", [{ids : access_token}]);

    if (!teamData) {
      return res.status(404).json({ status: 'error', message: 'Team data not found' });
    }

    const team_id = teamData[0].owner; // Replace with your actual team_id data
    
    const status = 1;
    const changed = Math.floor(Date.now() / 1000);
    const created = Math.floor(Date.now() / 1000);
    const ids = Common.makeid(13); // Generate a UUID for ids
    const insertParams = { ids, team_id, name, status, changed, created };
    
    const insertResult = await Common.db_insert("sp_whatsapp_contacts", insertParams);

    if (!insertResult) {
      return res.status(500).json({ status: 'error', message: 'Contact Create Failed' });
    }

    // Insert phones into sp_whatsapp_phone_numbers table
    const phoneInsertPromises = [];
    for (let i = 0; i < phone.length; i++) {
      const phone_data = {
        ids: Common.makeid(13),
        team_id,
        pid: insertResult.insertId,
        phone: phone[i]
      };
      phoneInsertPromises.push(Common.db_insert("sp_whatsapp_phone_numbers", phone_data));
    }

    const phoneResults = await Promise.all(phoneInsertPromises);

    if (phoneResults.some(result => !result)) {
      return res.status(500).json({ status: 'error', message: 'Some phone numbers failed to insert' });
    }

    return res.status(201).json({ status: 'success', contactId: insertResult.insertId });

  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});



WAZIPER.app.get('/api/get_contacts', WAZIPER.cors, async (req, res) => {
  try {
    const { access_token } = req.query;

    if (!access_token) {
      return res.status(400).json({ status: 'error', message: 'access_token is required' });
    }

    const teamData = await Common.db_fetch("sp_team", [{ids : access_token}]);

    if (!teamData) {
      return res.status(404).json({ status: 'error', message: 'Team data not found' });
    }

    const team_id = teamData[0].owner; // Replace with your actual team_id data

    const contacts = await Common.db_fetch("sp_whatsapp_contacts", [{team_id:team_id}]);

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No contacts found' });
    }

    return res.status(200).json({ status: 'success', contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});



const saveContact = async (data) => {
    let {team_id, name, phone} = data
    
    try {


    const status = 1;
    const changed = Math.floor(Date.now() / 1000);
    const created = Math.floor(Date.now() / 1000);
    const ids = Common.makeid(13); // Generate a UUID for ids
    const insertParams = { ids, team_id, name, status, changed, created };
    
    const insertResult = await Common.db_insert("sp_whatsapp_contacts", insertParams);

    // Insert phones into sp_whatsapp_phone_numbers table
    const phoneInsertPromises = [];
    for (let i = 0; i < phone.length; i++) {
      const phone_data = {
        ids: Common.makeid(13),
        team_id,
        pid: insertResult.insertId,
        phone: phone[i]
      };
      phoneInsertPromises.push(Common.db_insert("sp_whatsapp_phone_numbers", phone_data));
    }

    const phoneResults = await Promise.all(phoneInsertPromises);



    return insertResult.insertId

  } catch (error) {
    console.log('Error creating contact:', error);
  }
}



WAZIPER.app.post('/api/create_schedule', WAZIPER.cors, async (req, res) => {
  try {
    const {
      contact_id,
      time_post,
      min_delay,
      max_delay,
      name,
      caption,
      media,
      instance_id,
      phone
      } = req.body;
        const { access_token } = req.query;


    // Validate required fields
    if (!instance_id || !phone || !time_post || !min_delay || !max_delay || !name || !access_token) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }


    if (!access_token) {
      return res.status(400).json({ status: 'error', message: 'access_token is required' });
    }

    const teamData = await Common.db_fetch("sp_team", [{ids : access_token}]);

    if (!teamData) {
      return res.status(404).json({ status: 'error', message: 'Team data not found' });
    }

    const team_id = teamData[0].owner; // Replace with your actual team_id data
    
    
    const accData = await Common.db_fetch("sp_accounts", [{token : instance_id}]);
    

   if (!accData) {
      return res.status(404).json({ status: 'error', message: 'Instance not found' });
    }

let data = {team_id, name, phone}
    
    let dbID = await saveContact(data)

console.log(dbID)

    let schedule_time = ''
    const insertParams = {
      ids: Common.makeid(32),
      team_id,
      accounts: JSON.stringify([`${accData[0].id}`]), // Convert accounts to JSON string
      next_account: 1,
     contact_id:dbID,
      type: 1,
      template: 0,
      time_post,
      schedule_time,
      min_delay,
      timezone:"Asia/Kolkata",
      max_delay,
      name,
      caption,
      media,
      sent: 0,
      failed: 0,
      result: null,
      run: 0,
      status: 1,
      changed: Math.floor(Date.now() / 1000),
      created: Math.floor(Date.now() / 1000),
      smessage:"",
      snumber:"" ,
      sid:0
    };

    const insertResult = await Common.db_insert("sp_whatsapp_schedules", insertParams);

    console.log(insertResult)

    if (!insertResult) {
      return res.status(500).json({ status: 'error', message: 'Failed to create schedule' });
    }

    return res.status(201).json({ status: 'success', message: 'Schedule created successfully', schedule_id: insertResult.insertId });

  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});




WAZIPER.app.delete('/api/delete_campaign', WAZIPER.cors, async (req, res) => {
  try {
    const { schedule_id } = req.query;

    if (!schedule_id) {
      return res.status(400).json({ status: 'error', message: 'Schedule ID is required' });
    }


    const deleteResult = await Common.db_delete("sp_whatsapp_schedules",  [{ id: schedule_id }]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Schedule not found' });
    }

    return res.status(200).json({ status: 'success', message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


WAZIPER.app.get('/api/get_campaigns', WAZIPER.cors, async (req, res) => {
  try {
      
          const { access_token } = req.query;

      if (!access_token) {
      return res.status(400).json({ status: 'error', message: 'access_token is required' });
    }
    
    
    
    const teamData = await Common.db_fetch("sp_team", [{ids : access_token}]);

    if (teamData.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Team data not found' });
    }


    let team_id = teamData[0].owner

    const schedules = await Common.db_fetch("sp_whatsapp_schedules", [{team_id:team_id}]);

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No campaigns found' });
    }

    return res.status(200).json({ status: 'success', schedules });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


WAZIPER.app.get('/instance', WAZIPER.cors, async (req, res) => {
    var access_token = req.query.access_token;
    var instance_id = req.query.instance_id;

    await WAZIPER.instance(access_token, instance_id, false, res, async (client) => {
        await WAZIPER.get_info(instance_id, res);
    });
});


WAZIPER.app.get('/get_qrcode', WAZIPER.cors, async (req, res) => {
    var access_token = req.query.access_token;
    var instance_id = req.query.instance_id;

    await WAZIPER.instance(access_token, instance_id, true, res, async (client) => {
        await WAZIPER.get_qrcode(instance_id, res);
    });
});

WAZIPER.app.get('/get_groups', WAZIPER.cors, async (req, res) => {
    var access_token = req.query.access_token;
    var instance_id = req.query.instance_id;

    await WAZIPER.instance(access_token, instance_id, false, res, async (client) => {
        await WAZIPER.get_groups(instance_id, res);
    });
});

WAZIPER.app.get('/logout', WAZIPER.cors, async (req, res) => {
    var access_token = req.query.access_token;
    var instance_id = req.query.instance_id;
    WAZIPER.logout(instance_id, res);
});

WAZIPER.app.post('/send_message', WAZIPER.cors, async (req, res) => {
    var access_token = req.query.access_token;
    var instance_id = req.query.instance_id;

    await WAZIPER.instance(access_token, instance_id, false, res, async (client) => {
        WAZIPER.send_message(instance_id, access_token, req, res);
    });
});

WAZIPER.app.get('/', WAZIPER.cors, async (req, res) => {
    return res.json({ status: 'success', message: "Welcome to WAZIPER" });
});

WAZIPER.server.listen(8000, () => {
    console.log("WAZIPER IS LIVE");
});