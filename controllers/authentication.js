const jwt = require('jwt-simple');
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// user has already had their email/pw auth'd. 
	// we just need to provide them a token
	res.send({token : tokenForUser(req.user )});

}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: "Must provide an email and a password." });

	}

	// See if user with the email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) {
			return next(err);
		}

		// if user already exists, return error
		if (existingUser) {
			// 422:  unprocessable entitity error code
			return res.status(422).send({ error: "Email is in use" });
		}
	

		// if user w/ email does not exist, create and save user record
		const user = new User({ email: email, password: password });
		console.log(user);
		user.save(function(err) {
			if (err) {
				return next(err);
			}

		// 	// respond to request indicating that the user was saved
			res.json({ token: tokenForUser(user) });
		});
	});
}

