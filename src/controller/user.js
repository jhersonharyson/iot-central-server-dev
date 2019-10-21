import User from "../models/user";
import {
  NAME_ISINVALID,
  PASSWORD_ISINVALID
} from "../exceptions/userException";

export async function getUsers(req, res) {
  try {
    const users = await User.find({});
    return res.status(201).json({ users });
  } catch (e) {
    return res.status(400).send("UNEXPECTED_ERROR");
  }
}

export async function updateUser(req, res, next) {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    { useFindAndModify: true }
  );

  const { password, profile, name } = req.body;

  if (name)
    if (name.length >= 3 && name.length <= 80) {
      user.name = name;
    } else {
      return res.status(400).send(NAME_ISINVALID);
    }

  if (profile && ["JOUNIN", "CHUNIN", "GENIN"].indexOf(profile) >=0)
    user.profile = profile;

  if (password)
    if (password.length >= 3 && password.length <= 6) {
      await User.deleteOne({ _id: req.params.id });
      const newUser = await new User({
        name: user.name,
        email: user.email,
        profile: user.profile,
        password: password
      }).save();
      return res.send(newUser);
    } else return res.status(400).send(PASSWORD_ISINVALID);

  await user.save();

  res.send(user);
}

export async function deleteUser(req, res) {
  res.send(await User.deleteOne({ _id: req.params.id }));
}
