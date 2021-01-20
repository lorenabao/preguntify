require('dotenv').config()

const bcrypt = require('bcrypt');

const { getConnection } = require("./db");

async function main() {
  let connection;

  try {
    connection = await getConnection();
    
    console.log('Deleting tables')

    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("DROP TABLE IF EXISTS users CASCADE");
    await connection.query("DROP TABLE IF EXISTS off_users CASCADE");
    await connection.query("DROP TABLE IF EXISTS answers CASCADE");
    await connection.query("DROP TABLE IF EXISTS questions CASCADE");
    await connection.query("DROP TABLE IF EXISTS skills CASCADE");
    await connection.query("DROP TABLE IF EXISTS votes CASCADE");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log('Creating new tables')

    await connection.query(`
      CREATE TABLE users (
        id int unsigned auto_increment primary key,
        email varchar(500) not null,
        username varchar(500) not null, 
        password varchar(500) not null,
        name varchar(50) default 'undefined',
        surname varchar(50) default 'undefined',
        role enum('student', 'expert', 'admin') default 'student',
        birth_date date,
        avatar varchar(500) default 'undefined',
        user_registration_date timestamp,
        user_updated_date timestamp,
        last_connection timestamp,
        email_validation boolean default false,
        validation_code varchar(500) default 'undefined',
        token varchar(500) default 'undefined',
        registered_user boolean default true
        );
      `)

      await connection.query(`
      CREATE TABLE questions (
        id_question int unsigned auto_increment primary key,
        id_user int unsigned,
        question_title varchar(200),
        question_body varchar(3000),
        question_file varchar(500),
        language set('html', 'css', 'javascript', 'sql'),
        tag varchar(200),
        question_publish_date timestamp,
        question_update_date timestamp,
        status enum('open', 'pending', 'closed'),
        views int unsigned,
                
        constraint question_id_user_fk1
          foreign key (id_user) references users (id) ON DELETE CASCADE,
        constraint question_idUser_id_unique
          UNIQUE (id_user, id_question)
        );
      `)
      
      await connection.query(`
      CREATE TABLE answers (
        id_answer int unsigned auto_increment primary key,
        id_question int unsigned,
        id_user int unsigned,
        answer_body varchar(3000),
        answer_file varchar(500),
        answer_publish_date timestamp,
        answer_update_date timestamp,
                
        constraint answer_id_question_fk
          foreign key (id_question) references questions (id_question) ON DELETE CASCADE,
        constraint answer_id_user_fk
          foreign key (id_user) references users (id) ON DELETE CASCADE
        );
      `)

      await connection.query(`
      CREATE TABLE votes (
        id_vote int unsigned auto_increment primary key,
        id_answer int unsigned,
        id_user int unsigned,
        value boolean default false,
            
        constraint votes_id_answer_id_user_unique
          unique (id_answer, id_user, id_vote),
        constraint votes_id_anwer_fk1
          foreign key (id_answer) references answers (id_answer) ON DELETE CASCADE,
        constraint votes_id_user_fk2
          foreign key (id_user) references users (id) ON DELETE CASCADE
        );
      `)

      await connection.query(`
      CREATE TABLE skills (
        id_skill int unsigned auto_increment primary key,
        id_user int unsigned,
        html boolean default false,
        css boolean default false,
        javascript boolean default false,
        mysql boolean default false,
          
        constraint skills_id_user_fk
          foreign key (id_user) references users (id) ON DELETE CASCADE
        );
      `)
      
      await connection.query(`
      CREATE TABLE off_users (
        id_offUser int unsigned auto_increment primary key,
        id_user int unsigned,
        reason varchar(500),

        constraint offUser_idUser_fk1
          foreign key (id_user) references users (id) ON DELETE CASCADE,
        constraint offUser_idUser_id_unique
		      UNIQUE (id_user, id_offUser)
        );
      `);


    const passwordBcrypt = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
    
    console.log('Creating admin role')

    // Admin
    await connection.query(`
      INSERT INTO users (
        email, 
        username, 
        password, 
        name, 
        surname, 
        role, 
        avatar,
        user_registration_date,
        user_updated_date,
        last_connection, 
        email_validation, 
        validation_code,
        token,
        registered_user
      )
      VALUES (
        'lorenabaoperez@gmail.com',
        'loreb',
        ?,
        'Lorena',
        'Bao',
        'admin',
        null,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        true,
        null,
        null,
        true
      )`, [passwordBcrypt]
      );

      console.log('Creating students roles')

      // Student
      await connection.query(`
      INSERT INTO users (
        email, 
        username, 
        password, 
        name, 
        surname, 
        role, 
        avatar,
        user_registration_date,
        user_updated_date,
        last_connection, 
        email_validation, 
        validation_code,
        token,
        registered_user
      )
      VALUES (
        'pepito@preguntify.com',
        'pepito',
        ?,
        'Pepe',
        'Pérez',
        'student',
        null,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        true,
        null,
        null,
        true
      )`, [passwordBcrypt]
      );

      // Student
      await connection.query(`
      INSERT INTO users (
        email, 
        username, 
        password, 
        name, 
        surname, 
        role, 
        avatar,
        user_registration_date,
        user_updated_date,
        last_connection, 
        email_validation, 
        validation_code,
        token,
        registered_user
      )
      VALUES (
        'sofia@preguntify.com',
        'sofia',
        ?,
        'Sofía',
        'Pérez',
        'student',
        null,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        true,
        null,
        null,
        true
      )`, [passwordBcrypt]
      );

      console.log('Creating expert role')

      // Expert
      await connection.query(`
      INSERT INTO users (
        email, 
        username, 
        password, 
        name, 
        surname, 
        role, 
        avatar,
        user_registration_date,
        user_updated_date,
        last_connection, 
        email_validation, 
        validation_code,
        token,
        registered_user
      )
      VALUES (
        'mar@preguntify.com',
        'mar',
        ?,
        'Mar',
        'Pérez',
        'expert',
        null,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        true,
        null,
        null,
        true
      )`, [passwordBcrypt]
      );

  } catch (e) {
    console.log('Some error ocurred: ', e)
  } finally {
    console.log('Ready')
    if (connection) {
      connection.release();
    }
    process.exit();
  }
}

(async () => {
  await main()
})()
