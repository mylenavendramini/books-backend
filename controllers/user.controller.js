const { response } = require('express');
const User = require('../model/user.model');
const JWT = require('jsonwebtoken');
let bcrypt = require('bcrypt');
const authConfig = require('../config/config');
const RequestStatus = require('../utils/requestStatus');

exports.getUsers = async (request, response) => {
  try {
    const users = await User.find().populate({
      path: 'books',
      select: 'name',
      model: 'Book',
    });
    // const users = await User.find({name: "Maria"});
    if (users) {
      response.status(202).send(users);
    } else {
      response.status(400).json({ message: 'An error has occured!' });
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send('There was an error showing the user.');
  }
};

exports.getUser = async (request, response) => {
  try {
    let user = await User.findById({ _id: request.params.id });

    if (user) {
      return response.status(202).json(user);
    } else {
      return response.status(400).json({ message: 'An error has occured.' });
    }
  } catch (error) {
    return response.status(400).send({ message: 'User not found.' });
  }
};

exports.postUsers = async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const user = await User.create({
      name,
      email,
      password,
      permissions: 'USER',
    });
    if (user) {
      return response.send({ message: 'User created.', data: user });
    } else {
      return response.status(400).send('Error! User not created.');
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send('There was an error creating the user.');
  }
};

exports.putUsers = async (request, response) => {
  try {
    // const userId = request.params.id;
    const { id } = request.params;
    const user = request.body;
    // const userId = users.map((user) => user.id === id);
    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        $set: user,
      },
      { new: true }
    );
    if (userUpdated) {
      return response
        .status(202)
        .json({ message: 'User updated.', data: userUpdated });
    } else {
      return response.status(404).json({ message: 'Error! User not updated.' });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send('There was an error updating the user.');
  }
};

exports.deleteUsers = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedUser = await User.deleteOne({ _id: id });
    if (deletedUser.deletedCount > 0) {
      return response.status(200).json({ message: 'User deleted.' });
    } else {
      return response.status(400).json({ message: 'Error! User not deleted.' });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send('There was an error deleting the user.');
  }
};

const tokenKey = authConfig.secret;
// const tokenKey = "49fb775afa045a8d97a4ddba26c743cb";
console.log(tokenKey);
// default token = {}
const generateToken = (params = {}) => {
  return JWT.sign({ params }, tokenKey, { expiresIn: 10000 });
};

exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;
    // select({password: true}) is because the select password in user.model is set to false to don't show when we get users
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return response.status(404).send({ message: 'User not found!' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return response
        .status(400)
        .send({ message: 'Invalid password! Try again!' });
    }
    const token = generateToken({ id: user.id });
    user.password = undefined;
    // return response.send({ data: user, token });
    return response.send({
      message: 'Welcome ' + user.name,
      data: user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return response.status(400).send('There was an error with login.');
  }
};

exports.logout = async (request, response) => {
  const token = request.headers.authorization;

  if (!token)
    return response
      .status(RequestStatus.BAD_REQUEST)
      .json({ message: 'No token provided!' });

  if (!(await TokenBlacklist.findOne({ token: token }))) {
    await TokenBlacklist.create({ token });
    return response
      .status(RequestStatus.OK)
      .json({ message: 'Logout performed successfully!' });
  } else {
    return response
      .status(RequestStatus.NOT_MODIFIED)
      .json({ message: 'Logout already performed!' });
  }
};
