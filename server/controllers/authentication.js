import passport from 'passport';
import fs from 'fs';
import handelbars from 'handlebars';
import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';
import { buildResponse, joiValidate } from '../utils/helpers';
import { SIGNUP_FIELDS_SCHEMA, SERVER_ERROR_MESSAGE } from '../utils/constants';
import sendEmail from '../utils/emailService';

const readHTMLFile = path => fs.readFileSync(path);

const sendWelcomeEmail = async (name, email) => {
  const html = readHTMLFile(`${__dirname}/welcomeEmail.html`);
  const htmlTemplate = handelbars.compile(html.toString());
  const replacements = {
    Product: 'Groot',
    name,
  };
  const htmlTosend = htmlTemplate(replacements);
  await sendEmail(email, 'Groot', 'Welcome To Groot', '', htmlTosend);
};

const signUp = async (req, res) => {
  const [isValid, response] = joiValidate(req.body, SIGNUP_FIELDS_SCHEMA);
  if (!isValid) return res.status(400).send(response);

  const { email, name, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const errorMessage = 'This email is already in use!';
      return res.status(400).send(buildResponse(false, errorMessage));
    }
    const user = new User({ name, email, password });
    const newlyAddedUser = await user.save();

    const newDashboard = new Dashboard({
      userId: newlyAddedUser._id,
    });
    await newDashboard.save();
    await sendWelcomeEmail(name, email);
    return res.status(200).send(buildResponse(true, 'Signup successfully!'));
  } catch (err) {
    console.error(err);
    return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
  }
};

const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return res.status(500).send(buildResponse(false, info)); }
    if (!user) {
      return res.send(buildResponse(false, info.message));
    }
    req.login(user, (error) => {
      if (error) return res.status(500).send(buildResponse(false, SERVER_ERROR_MESSAGE));
      return res.status(200).send(buildResponse(true, 'Login successfully!', { name: req.user.name, email: req.user.email }));
    });
  })(req, res);
};

module.exports = {
  signUp,
  login,
};
