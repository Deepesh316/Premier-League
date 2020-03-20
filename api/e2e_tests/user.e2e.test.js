import supertest from 'supertest'
import app from '../app/app'
import http from 'http'
import User from '../models/user'
import { seededUser } from '../test-setup/seed'
import  { clearDatabase, closeDatabase  }  from '../test-setup/unit-test-db'
import mongoose from '../database/database' //this is important to connect to our test db 



let server, request, seededUser

beforeAll(async () => {
  server = http.createServer(app);
  await server.listen();
  request = supertest(server);
});

beforeEach(async () => {
    seededUser = await seedAdmin()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
});

/**
* Remove and close the test db and server.
*/
afterAll(async () => {
  await server.close();
  await closeDatabase();
});



describe('POST /user', () => {
  it('should create a user', async () => {
    let user = {
      name: 'victor',
      email: 'victor@example.com',
      password: 'password'
    }
    const res = await request
                      .post('/api/v1/users')
                      .send(user)

    const { _id, name, role } = res.body.data

    //we didnt return email and password, so we wont assert for them
    expect(res.status).toEqual(201);
    expect(_id).toBeDefined();
    expect(name).toEqual(user.name);
    expect(role).toEqual('user');

    //we can query the db to confirm the record
    const createdUser = await User.findOne({email: user.email })
    expect(createdUser).toBeDefined()
    expect(createdUser.email).toEqual(user.email);
    //since our password is hashed:
    expect(createdUser.password).not.toEqual(user.password);
  });

  it('should not create a user if the record already exist.', async () => {
    let user = {
      name: 'chikodi',
      email: seededUser.email, //a record that already exist
      password: 'password'
    }
    const res = await request
                      .post('/api/v1/users')
                      .send(user)

    expect(res.status).toEqual(500);
    expect(res.body.error).toEqual('record already exists');
  });


  it('should not create a user if validation fails', async () => {
    let user = {
      name: '', //the name is required
      email: 'victorexample.com', //invalid email
      password: 'pass' //the password should be atleast 6 characters
    }
    const res = await request
                      .post('/api/v1/users')
                      .send(user)

    const errorsResponse =  [ 
      { name: 'a valid name is required' },
      {email: 'a valid email is required'},
      { password: 'a valid password with atleast 6 characters is required' } 
    ]                  
    expect(res.status).toEqual(400);
    expect(JSON.stringify(res.body.errors)).toEqual(JSON.stringify(errorsResponse))
  });
});