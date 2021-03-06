var helpers = require('../../helpers');

module.exports = {
	title: 'Password Requires Lowercase',
	category: 'IAM',
	description: 'Ensures password policy requires at least one lowercase letter',
	more_info: 'A strong password policy enforces minimum length, expirations, reuse, and symbol usage',
	link: 'http://docs.aws.amazon.com/IAM/latest/UserGuide/Using_ManagingPasswordPolicies.html',
	recommended_action: 'Update the password policy to require the use of lowercase letters',
	apis: ['IAM:getAccountPasswordPolicy'],

	run: function(cache, settings, callback) {
		var results = [];
		var source = {};

		var region = 'us-east-1';

		var getAccountPasswordPolicy = helpers.addSource(cache, source,
				['iam', 'getAccountPasswordPolicy', region]);

		if (!getAccountPasswordPolicy) return callback(null, results, source);

		// Handle special case errors
		if (getAccountPasswordPolicy.err &&
			getAccountPasswordPolicy.err.code &&
			getAccountPasswordPolicy.err.code === 'NoSuchEntity') {
			helpers.addResult(results, 2, 'Account does not have a password policy');
			return callback(null, results, source);
		}

		if (getAccountPasswordPolicy.err || !getAccountPasswordPolicy.data) {
			helpers.addResult(results, 3,
				'Unable to query for password policy status: ' + helpers.addError(getAccountPasswordPolicy));
			return callback(null, results, source);
		}

		var passwordPolicy = getAccountPasswordPolicy.data;

		if (!passwordPolicy.RequireLowercaseCharacters) {
			helpers.addResult(results, 1, 'Password policy does not require lowercase characters');
		} else {
			helpers.addResult(results, 0, 'Password policy requires lowercase characters');
		}

		callback(null, results, source);
	}
};