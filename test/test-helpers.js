const moment = require('moment-timezone');

function makeForumsArray(){
    return [
        {
            id: 1,
            title: 'Call of doody',
            blurb: 'A game all about shit'
        },
        {
            id: 2,
            title: 'Kill it with fire',
            blurb: 'A game where you hunt spiders with awesome weapons'
        },
        {
            id: 3,
            title: 'Slay the Spire',
            blurb: 'A deckbuilding roguelite adventure!'
        }
    ];
}

function makeUserArray(){
    return [
        {
            id: 1,
            user_name: 'omegacoo',
            password: 'password',
            email: 'bsumser@yahoo.com'
        }
    ];
}

function makePostsArray(){
    return [
        {
            id: 1,
            user_id: 1,
            forum_id: 3,
            time_submitted: moment().tz('America/Los_Angeles').format(),
            content: 'This game is super cool!'
        },
        {
            id: 2,
            user_id: 1,
            forum_id: 2,
            time_submitted: moment().tz('America/Los_Angeles').format(),
            content: 'What a silly game!'
        },
        {
            id: 3,
            user_id: 1,
            forum_id: 3,
            time_submitted: moment().tz('America/Los_Angeles').format(),
            content: 'Right?!'
        },
    ];
}

module.exports = {
    makeForumsArray,
    makeUserArray,
    makePostsArray
};