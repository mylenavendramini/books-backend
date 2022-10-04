const User = require("../model/user.model");

exports.getUsers = async (request, response) => {
  try {
    const users = await User.find().populate({
      path: "books",
      select: "name",
      model: "Book",
    });
    // const users = await User.find({name: "Maria"});
    if (users) {
      response.status(202).send(users);
    } else {
      response.status(400).json("An error has occured!");
    }
  } catch (error) {
    console.log(error.message);
    response.status(400).send("There was an error showing the user.");
  }
};

exports.postUsers = async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      return response.send({ message: "User created.", data: user });
    } else {
      return response.status(400).send("Error! User not created.");
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send("There was an error creating the user.");
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
        .json({ message: "User updated.", data: userUpdated });
    } else {
      return response.status(404).json({ message: "Error! User not updated." });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send("There was an error updating the user.");
  }
};

exports.deleteUsers = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedUser = await User.deleteOne({ _id: id });
    if (deletedUser.deletedCount > 0) {
      return response.status(200).json({ message: "User deleted." });
    } else {
      return response.status(400).json({ message: "Error! User not deleted." });
    }
  } catch (error) {
    console.log(error.message);
    return response.status(400).send("There was an error deleting the user.");
  }
};
