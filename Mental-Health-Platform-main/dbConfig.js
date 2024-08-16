// require("dotenv").config()


// const { Pool } = require('pg'); // Import the Pool constructor

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_Port,
//   database: process.env.DB_DATABASE
// });
/////////////////////////////////////////////////////////
// module.exports = pool;

// require("dotenv").config();

// const { Pool } = require("pg");

// const isProduction = process.env.NODE_ENV === "production";

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   ssl: isProduction
// });

// module.exports = { pool };

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: 'abc123',
  port: 5432, // PostgreSQL default port
});

// async function insertUserData(id,name, email, password) {
//   const query = 'INSERT INTO users (id,name, email, password) VALUES ($1, $2, $3, $4)';
//   const values = [id,name, email, password];

//   try {
//     await pool.query(query, values);
//     console.log('Data inserted successfully');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   }
// }

async function insertUserData(id, name, email, password) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    const query = 'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)';
    const values = [id, name, email, password];

    await client.query(query, values);
    await client.query('COMMIT'); // Commit the transaction

    console.log('Data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error inserting data:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}


///77 to 109 comment on 15-09-2023

// async function AuthenticateData(email,password){
//   const client=await pool.connect();
//   const query='SELECT * FROM users WHERE email = $1 AND password = $2';
//   //  console.log(query)

//   // client.connect();
//   client.query('Select * from users where email=$1 and password=$2',(err,res)=>{
//     if(!err){
//         console.log(res.rows);
//     }
//     else{
//         console.log(err.message);
//     }
//     // client.end;
// })

//   const values=[email,password];
//   console.log(values)
//   try{
//     const { rows } = await client.query(query,values);
//     console.log(rows);
//     if (rows.length==1)
//     {
//       return rows[0];
//     }
//     else{
//       return null;
//     }
//   }catch(error){
//     console.error('Error authenticating data:', error);
//     throw error;
//   }
// }


async function AuthenticateData(email, password) {
  const client = await pool.connect();
  const query = 'SELECT * FROM users left join sessions on users.id=sessions.id WHERE email = $1 AND password = $2';
  const values = [email, password];

  try {
    const { rows } = await client.query(query, values);

    if (rows) {
      const user = rows[rows.length-1];
      return user; // Return the user data
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error authenticating data:', error);
    throw error;
  } finally {
    client.release(); // Release the database connection
  }
}


//   console.log(email, password);
//     pool.query(
//       `SELECT * FROM users WHERE email = $1`,
//       [email],
//       (err, results) => {
//         if (err) {
//           throw err;
//         }
//         console.log(res.rows);

//         if (results.rows.length > 0) {
//           const user = results.rows[0];

//           bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) {
//               console.log(err);
//             }
//             if (isMatch) {
//               res.redirect("profile_client")
//               return user
//             } else {
//               //password is incorrect
//               return null 
//             }
//           });
//         } else {
//           // No user
//           return done(null, false, {
//             message: "No user with that email address"
//           });
//         }
//       }
//     );

// }
async function insertPsyData(psy_id, psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    const query = 'INSERT INTO psychologist(psy_id, psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [psy_id, psy_name, psy_email, psy_no, psy_address, Psy_exp, psy_clinic, psy_password];

    await client.query(query, values);
    await client.query('COMMIT'); // Commit the transaction

    console.log('Data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error inserting data:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}


async function insertSessionData(session_id, psy_name, id, psy_id, session_date, session_time, meetlink) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    const query = 'INSERT INTO sessions (session_id, psy_name, id, psy_id, session_date, session_time, meetlink) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [session_id, psy_name, id, psy_id, session_date, session_time, meetlink];

    await client.query(query, values);
    await client.query('COMMIT'); // Commit the transaction

    console.log('Session created successfully');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}


//17-09-2023

async function AuthenticatePsyData(psy_email, psy_password) {
  const client = await pool.connect();
 // const query = 'SELECT * FROM psychologist WHERE psy_email = $1 AND psy_password = $2';
 const query = 'SELECT * FROM psychologist left join sessions on psychologist.psy_id=sessions.psy_id WHERE psy_email = $1 AND psy_password = $2 ';
  const values = [psy_email, psy_password];

  try {
    const { rows } = await client.query(query, values);

    if (rows) {
      const user = rows[rows.length-1];
      return user; // Return the user data
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error authenticating data:', error);
    throw error;
  } finally {
    client.release(); // Release the database connection
  }
}

//17-09-2023 end

//17-09-2023 start

// async function fetchPsy(){
//   const client = await pool.connect();
//   const query = 'SELECT psy_name,psy_email FROM psychologist ';

  

//   try {
//     const { rows } = await client.query(query);
//     console.log(res.rows);
//     if (rows.length === 1) {
//       const user = rows[0];
      
//       return user; // Return the user data
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error authenticating data:', error);
//     throw error;
//   } finally {
//     client.release(); // Release the database connection
//   }
// }

//19-09-2023 start

async function insertBlogData(blog_id, psy_name_blog, blog_title, blog_content) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start a transaction

    const query = 'INSERT INTO blog (blog_id, psy_name_blog, blog_title, blog_content) VALUES ($1, $2, $3, $4)';
    const values = [blog_id, psy_name_blog, blog_title, blog_content];

    await client.query(query, values);
    await client.query('COMMIT'); // Commit the transaction

    console.log('Blogs successfully');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}


//19-09-2023 end

//25-09-2023 start

async function insertComment(blog_id,comment_id, user_name, comment) {
  const client = await pool.connect();


  try {
    await client.query('BEGIN'); // Start a transaction


    const query = 'INSERT INTO comments ( blog_id,comment_id, user_name, comment) VALUES ($1, $2, $3,$4)';
    const values = [blog_id,comment_id, user_name, comment];


    await client.query(query, values);
    await client.query('COMMIT'); // Commit the transaction


    console.log('comment successfully');
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error:', error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}
//25-09-2023 end

async function insertReportData(report_id, id, psy_id, session_id, report_text, session_date) {
  const client = await pool.connect();
  
  try {
  await client.query('BEGIN'); // Start a transaction
  
  const query = 'INSERT INTO reports(report_id, id, psy_id, session_id, report_text, session_date) VALUES ($1, $2, $3, $4, $5, $6)';
  const values = [report_id, id, psy_id, session_id, report_text, session_date];
  
  await client.query(query, values);
  await client.query('COMMIT'); // Commit the transaction
  
  console.log('Report prepared successfully');
    } catch (error) {
  await client.query('ROLLBACK'); // Rollback the transaction if there's an error
  console.error('Error:', error);
    } finally {
  client.release(); // Release the client back to the pool
    }
  }
  


module.exports = { pool , insertUserData, AuthenticateData, insertPsyData, insertSessionData, AuthenticatePsyData, insertBlogData, insertComment, insertReportData};





