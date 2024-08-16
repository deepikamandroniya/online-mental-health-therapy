



const express = require("express");
const { pool, fetchPsy } = require("./dbConfig");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const client=require("./dbConfig/databasepg.js")
const {insertUserData}=require("./dbConfig.js")
const {insertPsyData}=require("./dbConfig.js")
const {insertSessionData}=require("./dbConfig.js")
const {AuthenticateData}=require("./dbConfig.js")
const {AuthenticatePsyData}=require("./dbConfig.js")
const {insertBlogData}=require("./dbConfig.js")
const {insertComment}=require("./dbConfig.js")
const {insertReportData}=require("./dbConfig.js")
//08-10-2023 start
const axios = require('axios');
const graphApiUrl = 'https://graph.microsoft.com/v1.0/me/onlineMeetings';

//08-10-2023 end
//const flash = require("express-flash");
//new line next
const session = require("express-session");
const session1 = require("express-session");
//25-09-2023 start
const randomstring = require("randomstring");
//25-09-2023 end
require("dotenv").config();
const app = express();
//new line next
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);

// Middleware
//15-09-2023 start

app.use(session({
  secret: 'your-secret-key', // Replace with a strong and secure secret
  resave: false,
  saveUninitialized: true,
}));
//15-09-2023 end

//17-09-2023 start
app.use(session1({
  secret: 'your-secret-key_psy', // Replace with a strong and secure secret
  resave: false,
  saveUninitialized: true,
}));

//17-09-2023 end
// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");


app.use(passport.initialize());


app.get("/", (req, res) => {
  const user = req.session.user;
  res.render("index.ejs",{user});
});

app.get('/session',(req,res)=>{
    res.render('session.ejs')
})


//18-09-2023 start 
// app.get('/psychologist',async (req,res)=>{
//     //res.render('psychologist.ejs');
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM psychologist');
  
//       res.json(result.rows);
//       client.release();
//     } catch (error) {
//       console.error('Error fetching psychologist :', error);
//       res.status(500).json({ error: 'An error occurred while fetching ' });
//     }

// })

app.get('/psychologist', async (req, res) => {
  try {
    const user = req.session.user;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM psychologist');
  
    // Render an EJS template and pass the data to it
    res.render('psychologist', { user, psychologistData: result.rows });

    client.release();
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    res.status(500).json({ error: 'An error occurred while fetching psychologist' });
  }
});

//18-09-2023 end

app.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})

app.get('/About',(req,res)=>{
  const user = req.session.user;
    res.render('About.ejs' , {user})
})

app.get('/Blogs',async (req,res)=>{
   // res.render('Blogs.ejs')
   try {
    const user = req.session.user;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM blog');
  
    // Render an EJS template and pass the data to it
    res.render('Blogs', { user,blogData: result.rows });

    client.release();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching blogs' });
  }
})

//19-09-2023 start

app.get('/write_blogs',(req,res)=>{
   const user = req.session.user;
  res.render('write_blogs.ejs',{user})
})

//19-09-2023 end

app.get('/profile_client',(req,res)=>{
    //res.render('Profile_client.ejs',{ user: req.client.email })
    if (req.session.user) {
      // Access user data from the session
      const user = req.session.user;
  
      // Render the profile page with user data
      res.render("profile_client", { user: user.email });
    } else {
      // If the user is not authenticated, you can handle it as needed (e.g., redirect to a login page)
      res.redirect("/login");
    }
})

app.get('/select_role',(req,res)=>{
  res.render('select_role.ejs')
})

app.get('/session_set',(req,res)=>{
  const user = req.session.user;
    res.render('session_set.ejs',{user})
})

//26-09-2023 start 

// app.get('/set_slot',(req,res)=>{
//   res.render('set_slot.ejs')
// })

//26-09-2023 end

app.get('/register_psy',(req,res)=>{
  res.render('register_psy.ejs')
})

app.get('/login_psy',(req,res)=>{
  res.render('login_psy.ejs')
})

//02-10-2023 start
// app.get('/view_psychologist',(req,res)=>{
//    // res.render('view_psychologist.ejs', { user: req.client.name })
//    //17-09-2023 start

//    if (req.session.user) {
//     // Access user data from the session
//     const user = req.session.user;

//     // Render the profile page with user data
//     res.render("view_psychologist", { user});
//   } else {
//     // If the user is not authenticated, you can handle it as needed (e.g., redirect to a login page)
//     res.redirect("/login_psy");
//   }

//   //17-09-2023 end
// })

app.get('/view_psychologist',(req,res)=>{
  //res.render('Profile_client.ejs',{ user: req.client.email })
  if (req.session.user) {
    // Access user data from the session
    const user = req.session.user;

    // Render the profile page with user data
    res.render("view_psychologist", { user: user.email });
  } else {
    // If the user is not authenticated, you can handle it as needed (e.g., redirect to a login page)
    res.redirect("/login");
  }
})

//02-10-2023 end


app.get("/signup", checkAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  //console.log(req.session.flash.error);
  res.render("login.ejs");
});

app.get("/login_psy", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  //console.log(req.session.flash.error);
  res.render("login_psy.ejs");
});

app.get("/profile_client", checkNotAuthenticated, (req, res) => {
  // console.log(req.isAuthenticated());
  // res.render("profile_client", { user: req.client.email });

  if (req.session.user) {
    // Access user data from the session
    //const user = req.session.user;

    // Render the profile page with user data
   // res.render("profile_client", { user: user.email });

   res.render("profile_client", { user });

  } else {
    // If the user is not authenticated, you can handle it as needed (e.g., redirect to a login page)
    res.redirect("/login");
  }

});


app.get('/logout', (req, res) => {
  // Remove user-related data from the session
  delete req.session.user; // Or req.session.user = undefined;
  res.redirect('/'); // Redirect to a different page after logout
});


//new add 07/09/2023

app.use(express.static(__dirname + '/public'));


app.post('/signup', async (req, res) => {
  let { name, email, password } = req.body;

  let errors = [];

  var id=Date.now().toString();
  console.log({
    id,
    name,
    email,
    password,
  
  });
  // var hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);

  try {
    // Extract user data from the request body
    const { name, email, password } = req.body;

    // Call the insertUserData function to insert the data into the database
    await insertUserData(id,name, email, password);

    // Send a success response or perform any additional actions
    // res.status(201).json({ message: 'Registration successful' });
    res.redirect("profile_client")
  } catch (error) {
    console.error('Registration error:', error);
    // res.status(500).json({ message: 'Registration failed' });
  }
});


app.post('/register_psy', async (req, res) => {
  let { psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password } = req.body;

  let errors = [];

  var psy_id=Date.now().toString();
  console.log({
    psy_id,
    psy_name,
    psy_email,
    psy_no, 
    psy_address, 
    Psy_exp, 
    psy_clinic,
    psy_password,
  
  });
  

  try {
    // Extract user data from the request body
    const { psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password } = req.body;

    // Call the insertUserData function to insert the data into the database
    await insertPsyData(psy_id, psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password);

    
    res.redirect("view_psychologist")
  } catch (error) {
    console.error('Registration error:', error);
    
  }
});


app.post('/session_set', async (req, res) => {
  let {  psy_name, id, psy_id, session_date, session_time } = req.body;

  let errors = [];

  var session_id=Date.now().toString();
  //25-09-2023 start 
  var meetlink = await createMeetingLink();
  //25-09-2023 end
  console.log({
    session_id,
    psy_name,
    id, 
    psy_id, 
    session_date, 
    session_time,
    meetlink
  });

  // var hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);

  try {
    // Extract user data from the request body
    const { psy_name, id, psy_id, session_date, session_time  } = req.body;

    // Call the SessionData function to insert the data into the database
    await insertSessionData( session_id, psy_name, id, psy_id, session_date, session_time, meetlink);

    // Send a success response or perform any additional actions
    //10-10-2023 start

    transporter.sendMail(mailConfigurations, function(error, info){ 
      if (error) throw Error(error); 
         console.log('Email Sent Successfully'); 
      //console.log(info); 
    });


    res.redirect("profile_client")
  } catch (error) {
    console.error('Error:', error);
    // res.status(500).json({ message: 'Session_set failed' });
  }
});

//19-09-2023 start



app.post('/write_blogs', async (req, res) => {
  let {  psy_name_blog, blog_title, blog_content } = req.body;

  let errors = [];

  var blog_id=Date.now().toString();
  console.log({
    blog_id,
    psy_name_blog,
    blog_title,
    blog_content,

  });

  // var hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);

  try {
    // Extract user data from the request body
    const {  psy_name_blog, blog_title, blog_content } = req.body;

    // Call the SessionData function to insert the data into the database
    await insertBlogData( blog_id, psy_name_blog, blog_title, blog_content );

    // Send a success response or perform any additional actions
    
    res.redirect("view_psychologist")
  } catch (error) {
    console.error('Error:', error);
    // res.status(500).json({ message: 'blogs failed' });
  }
});

//19-09-2023 end

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/profile_client");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthenticateData(email, password); // Now it's an async function
    if (user) {
      
      req.session.user = user;
      //res.redirect("/profile_client")

     // res.render("profile_client",{ user: req.client.email })
      //res.json({ message: 'Authentication successful', user });

      res.render('profile_client', { user });

    } else {
      res.status(401).json({ message: 'Authentication failed' });

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
  //17-09-2023 start

  app.post('/login_psy', async (req, res) => {
    const { psy_email, psy_password } = req.body;
  try {
    const user = await AuthenticatePsyData(psy_email, psy_password); // Now it's an async function
    if (user) {
      
      req.session.user = user;
      //res.redirect("/profile_client")

     // res.render("profile_client",{ user: req.client.email })
      //res.json({ message: 'Authentication successful', user });

      res.render('view_psychologist', { user });

    } else {
      res.status(401).json({ message: 'Authentication failed' });

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  });
  //17-09-2023  end

  //25-09-2023 start

  function generateGoogleMeetlink() {
    try{
    const baseUrl = 'https://meet.google.com/';
    var p1 = generateUniqueMeetingId(3).toString();
    var p2 = generateUniqueMeetingId(4).toString();
    var p3 = generateUniqueMeetingId(3).toString();
    var uniqueMeetingId = p1 +"-"+p2+"-"+p3; // Implement your logic to generate a unique meeting ID
    return baseUrl + uniqueMeetingId;
  }

catch (error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
   }
  }
  function generateUniqueMeetingId(length) {
    try{
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
  
    // for (let i = 0; i < length; i++) {
    //   const randomIndex = crypto.randomInt(alphabet.length);
    //   result += alphabet.charAt(randomIndex);
    // }

    result = randomstring.generate({
      length: length,
      charset: 'abcdefghijklmnopqrstuvwxyz'
    });
  
    return result;
  }
    catch (error){
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  //25-09-2023 end


  //25-09-2023 start

  //full blog and visible the comments
  app.get('/read_more/:blog_id', async (req, res) => {
    const blogId = req.params.blog_id;
  
  
    try {
      const user = req.session.user;
      const blogQuery = `SELECT blog_id, blog_title, blog_content, psy_name_blog FROM blog WHERE blog_id = $1`;
      const blogResult = await pool.query(blogQuery, [blogId]);
  
  
      if (blogResult.rows.length === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        const blog = blogResult.rows[0];
  
  
        // Fetch comments related to the blog post
        const commentsQuery = `SELECT * FROM comments WHERE blog_id = $1`;
        const commentsResult = await pool.query(commentsQuery, [blogId]);
        const comments = commentsResult.rows;
  
  
        res.render('read_more', { user,blog, comments }); // Render the read_more.ejs template with comments
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  
  // To add a new comment to a blog post
  
  
  
  
  app.post('/read_more', async (req, res) => {
    try {
      const { blog_id, user_name, comment } = req.body;
  
  
      // Call the insertcomment function to insert the data into the database
      const comment_id = Date.now().toString(); // Generate a unique comment_id
      await insertComment(blog_id, comment_id, user_name, comment);
  
  
      res.redirect(`/read_more/${blog_id}`);
    } catch (error) {
      console.error('Comment submission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  //26-09-2023 start

  //full blog and visible the comments
  app.get('/set_slot/:psy_id', async (req, res) => {
    const psyId = req.params.psy_id;
  
  
    try {
      const user = req.session.user;
      const psyQuery = `SELECT psy_id, psy_email, psy_name FROM psychologist WHERE psy_id = $1`;
      const psyResult = await pool.query(psyQuery, [psyId]);
  
  
      if (psyResult.rows.length === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        const psy = psyResult.rows[0];
  
        
        res.render('set_slot', { user,psy }); // Render the read_more.ejs template with comments
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  
  // To add a new comment to a blog post
  // Call the insertcomment function to insert the data into the database
      //const comment_id = Date.now().toString(); // Generate a unique comment_id
      //await insertComment(blog_id, comment_id, user_name, comment);
  
  app.post('/set_slot', async (req, res) => {
    try {
      const { psy_id, psy_slot } = req.body;
      
      const updateQuery = `
      UPDATE psychologist
      SET psy_slot = $1
      WHERE psy_id = $2
    `;
    
    const values = [psy_slot, psy_id];

    await pool.query(updateQuery, values);

    console.log("updated slot");
  
      res.redirect(`/set_slot/${psy_id}`);
    } catch (error) {
      console.error('Comment submission error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //26-09-2023 end

  //26-09-2023 start

  app.get('/take_session/:psy_id', async (req, res) => {
    const psyId = req.params.psy_id;
  
  
    try {
      const user = req.session.user;

      const psyQuery = `SELECT psy_id, psy_name FROM psychologist WHERE psy_id = $1`;
      const psyResult = await pool.query(psyQuery, [psyId]);
  
  
      if (psyResult.rows.length === 0) {
        res.status(404).json({ error: 'Post not found' });
      } else {
        const psychologist = psyResult.rows[0];
  
        
        res.render('take_session', { user, psychologist }); // Render the read_more.ejs template with comments
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }


  });

  //26-09-2023 end

//session history

//26-09-2023 start

// app.get('/session_history/:psy_id', async (req, res) => {
//   const psyId = req.params.psy_id;
//   try {
//         const client = await pool.connect();
//         const query='SELECT * FROM sessions INNER JOIN users ON sessions.id = users.id WHERE sessions.psy_id = $1;'
//         const sessions = await pool.query(query, [psyId]);
//         res.render('session_history', { sessions: sessions.rows });
//         client.release();
//       } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//       }
//     });

//     app.get('/session_history/:id', async (req, res) => {
//       const Id = req.params.id;
//       try {
//             const client = await pool.connect();
//             const query='SELECT * FROM sessions INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.psy_id = $1;'
//             const sessions = await pool.query(query, [Id]);
//             res.render('session_history', { sessions: sessions.rows });
//             client.release();
//           } catch (err) {
//             console.error(err);
//             res.status(500).send('Server Error');
//           }
//         });
    
    //26-09-2023 end

   // 02-10-2023 start
    // app.get('/session_history/:id/:type?', async (req, res) => {
    //   const id = req.params.id;
    //   const type = req.params.type || 'psy_id'; // Default to 'psy_id' if 'type' is not provided
    
    //   try {
    //     const client = await pool.connect();
    //     let query;
    
    //     if (type === 'psy_id') {
    //       query = 'SELECT * FROM sessions INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.psy_id = $1;';
    //     } else {
    //       query = 'SELECT * FROM sessions INNER JOIN users ON sessions.id = users.id WHERE sessions.psy_id = $1;';
    //     }
    
    //     const sessions = await pool.query(query, [id]);
    //     res.render('session_history', { sessions: sessions.rows });
    //     client.release();
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Server Error');
    //   }
    // });


    // Route for fetching session history for a psychologist
app.get('/session_history/psychologist/:psy_id', async (req, res) => {
  const psyId = req.params.psy_id;
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM sessions INNER JOIN users ON sessions.id = users.id WHERE sessions.psy_id = $1;';
    const sessions = await pool.query(query, [psyId]);
    const sessionType = 'user';
    res.render('session_history', { sessions: sessions.rows,sessionType });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for fetching session history for a user
app.get('/session_history/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM sessions INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
   // const query = 'SELECT sessions.id, sessions.session_date, sessions.session_time, users.name AS client_name, psychologist.psy_id, psychologist.psy_name FROM sessions INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
    const sessions = await pool.query(query, [userId]);
    const sessionType = 'psychologist';
    res.render('session_history', { sessions: sessions.rows,sessionType });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//02-10-2023 end    



    app.get('/sessionReportForm',(req,res)=>{
      res.render('sessionReportForm.ejs')
  })

    app.post('/sessionReportForm', async (req, res) => {
      let {  id, psy_id,session_id,report_text,session_date } = req.body;
      
      leterrors = [];
      
      var report_id=Date.now().toString();
      console.log({
      report_id,id,psy_id,session_id,report_text,session_date
      
        });
      
      // var hashedPassword = await bcrypt.hash(password, 10);
      //   console.log(hashedPassword);
      
      try {
      // Extract user data from the request body
      const { id,psy_id,session_id,report_text,session_dates } = req.body;
      
      // Call the SessionData function to insert the data into the database
      await insertReportData( report_id,id,psy_id,session_id,report_text,session_date );
      
      // Send a success response or perform any additional actions
      
      res.redirect("view_psychologist")
        } catch (error) {
      console.error('Error:', error);
      // res.status(500).json({ message: 'blogs failed' });
        }
      });
      

      //02-10-2023 start
      app.get('/report',(req,res)=>{
        res.render('report.ejs')
      })

      app.get('/payment',(req,res)=>{
        res.render('payment.ejs')
      })

      app.get('/session_pending_list',(req,res)=>{
        res.render('session_pending_list.ejs')
      })

      app.get('/session_history/user/report/:session_id', async (req, res) => {
        const SessionId = req.params.session_id;
        try {
          const client = await pool.connect();
          const query = 'SELECT * FROM sessions INNER JOIN reports ON sessions.session_id = reports.session_id INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.session_id = $1;';
         // const query = 'SELECT sessions.id, sessions.session_date, sessions.session_time, users.name AS client_name, psychologist.psy_id, psychologist.psy_name FROM sessions INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
          const sessions = await pool.query(query, [SessionId]);
          res.render('report', { sessions: sessions.rows});
          client.release();
        } catch (err) {
          console.error(err);
          res.status(500).send('Server Error');
        }
      });

      app.get('/payment/user/:id', async (req, res) => {
        const userId = req.params.id;
        try {
          const client = await pool.connect();
          const query = 'SELECT * FROM reports WHERE reports.id = $1;';
         // const query = 'SELECT sessions.id, sessions.session_date, sessions.session_time, users.name AS client_name, psychologist.psy_id, psychologist.psy_name FROM sessions INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
          const sessions = await pool.query(query, [userId]);
          const sessionType = 'psychologist';
          res.render('session_history', { sessions: sessions.rows,sessionType });
          client.release();
        } catch (err) {
          console.error(err);
          res.status(500).send('Server Error');
        }
      });

      app.get('/session_pending_list/psychologist/:psy_id', async (req, res) => {
        const psyId = req.params.psy_id;
        try {
          const client = await pool.connect();
          const query = 'SELECT * FROM sessions INNER JOIN users ON sessions.id = users.id WHERE sessions.psy_id = $1;;';
         // const query = 'SELECT sessions.id, sessions.session_date, sessions.session_time, users.name AS client_name, psychologist.psy_id, psychologist.psy_name FROM sessions INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
          const sessions = await pool.query(query, [psyId]);
         // const sessionType = 'psychologist';
          res.render('session_pending_list', { sessions: sessions.rows });
          client.release();
        } catch (err) {
          console.error(err);
          res.status(500).send('Server Error');
        }
      });

      app.get('/view_psychologist/:psy_id', async (req, res) => {
        const psyId = req.params.psy_id;
        try {
          const client = await pool.connect();
          const query = 'SELECT * FROM psychologist  WHERE psychologist.psy_id = $1;;';
         // const query = 'SELECT sessions.id, sessions.session_date, sessions.session_time, users.name AS client_name, psychologist.psy_id, psychologist.psy_name FROM sessions INNER JOIN users ON sessions.id = users.id INNER JOIN psychologist ON sessions.psy_id = psychologist.psy_id WHERE sessions.id = $1;';
          const psychologist = await pool.query(query, [psyId]);
         // const sessionType = 'psychologist';
          res.render('view_psychologist', { user: psychologist.rows });
          client.release();
        } catch (err) {
          console.error(err);
          res.status(500).send('Server Error');
        }
      });


      //08-10-2023 start

      const { google } = require('googleapis');

// Authenticate with the Google Calendar API (OAuth 2.0)
const auth = new google.auth.OAuth2({
  clientId: '',
  clientSecret: '',
  redirectUri: 'http://localhost:3000',
});

auth.setCredentials({
  access_token: '',
});
// Set up the Calendar API client
const calendar = google.calendar({ version: 'v3', auth });

// Define the calendar event with conference data
// const event = {
//   summary: 'Meeting Title',
//   description: 'Meeting Description',
//   start: {
//     dateTime: '2023-10-10T09:00:00',
//     timeZone: 'Asia/Kolkata',
//   },
//   end: {
//     dateTime: '2023-10-10T10:00:00',
//     timeZone: 'Asia/Kolkata',
//   },
//   conferenceData: {
//     createRequest: {
//       requestId: 'your-unique-request-id',
//     },
//   },
// };

// // Create the event
// calendar.events.insert({
//   calendarId: 'primary', // Use 'primary' for the user's primary calendar
//   resource: event,
//   conferenceDataVersion: 1, // Use version 1 of conference data
// }, (err, res) => {
//   if (err) {
//     console.error('Error creating event:', err);
//     return;
//   }

//   console.log('Event created: %s', res.data.htmlLink);
//   console.log('Google Meet link: %s', res.data.conferenceData.entryPoints[0].uri);
// });


async function createMeetingLink() {
  try {
    // Define the calendar event with conference data
    const event = {
      summary: 'Meeting Title',
      description: 'Meeting Description',
      start: {
        dateTime: '2023-10-28T06:00:00',
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: '2023-10-28T7:00:00',
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: 'your-unique-request-id',
        },
      },
    };

    // Create the event
    const response = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for the user's primary calendar
      resource: event,
      conferenceDataVersion: 1, // Use version 1 of conference data
    });

    // Extract the Google Meet link from the response
    const meetLink = response.data.conferenceData.entryPoints[0].uri;

    return meetLink;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Example usage of the createMeetingLink function
//createMeetingLink()
 // .then((meetLink) => {
 //   console.log('Google Meet link:', meetLink);
 // })
 // .catch((error) => {
   // console.error('Error:', error);
 // });


  //10-10-2023 start
  const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
    type: 'OAuth2', 
    user: '', 
    pass: '', 
    clientId: '', 
    clientSecret: '', 
    refreshToken: ''
  } 
}); 

const mailConfigurations = { 
  
  // It should be a string of sender email 
  from: '', 
    
  // Comma Separated list of mails 
  to: '', 

  // Subject of Email 
  subject: 'Notification for Upcoming Session', 
    
  // This would be the text of email body 
  text: 'Hi! There, You have a session scheduled'
    + ' on date 30/10/2023. '
    + 'Don`t forget to join.'
};


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

