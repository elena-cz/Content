const users = {
  1: {
    id: 1,
    username: 'Rey',
    profile_img_url: 'http://lorempixel.com/640/480',
    following: [2, 3, 4],
    followers: [3, 4],
  },
  2: {
    id: 2,
    username: 'KyloRen',
    profile_img_url: 'http://lorempixel.com/640/480',
    following: [3, 4],
    followers: [1, 4],
  },
  3: {
    id: 3,
    username: 'Finn',
    profile_img_url: 'http://lorempixel.com/640/480',
    following: [1, 4],
    followers: [1, 2],
  },
  4: {
    id: 4,
    username: 'Poe',
    profile_img_url: 'http://lorempixel.com/640/480',
    following: [1, 2],
    followers: [1, 2, 3],
  },
};


const generatePost = (postUserId) => ({
  user_id: postUserId,
  username: users[postUserId].username,
  profile_img_url: 'http://lorempixel.com/640/480',
  img_url: 'http://lorempixel.com/640/399',
  caption: '#maytheforcebewithyou',
  location: 'Berkeley, CA',
  like_count: 10,
});


// Add friend likes from users who are followed by both
// the post creator and feed owner
const generateFriendLikes = (feedUserId, postId) => {
  const row = {
    user_id: feedUserId,
    post_id: postId,
    friend_likes: [],
  };

  const postUserId = postId % 4 || 4;

  for (var id in users) {
    if (id !== postUserId &&
        id !== feedUserId &&
        users[id].following.includes(postUserId) &&
        users[id].following.includes(feedUserId)
        ) {
      row.friend_likes.push({ user_id: id, username: users[id].username })
    }
  }
  return row;
};



const generateSeedData = () => {
  const seedData = {};
  seedData.posts = [];
  seedData.feeds = [
    { user_id: 1, post_feed: [] },
    { user_id: 2, post_feed: [] },
    { user_id: 3, post_feed: [] },
    { user_id: 4, post_feed: [] }
    ];
  seedData.friendLikes = [];

  for (let postId = 1; postId <= 40; postId++) {

    const postUserId = postId % 4 || 4;
    // Generate post
    seedData.posts.push(generatePost(postUserId));

    // Add post to feeds of post creator's followers & 
    // Add friend_likes row for each post added to feed
    const followers = users[postUserId].followers;
    followers.forEach(feedUserId => {
      seedData.feeds[feedUserId -1].post_feed.push(postId);
      seedData.friendLikes.push(generateFriendLikes(feedUserId, postId))
    })
  }
  return seedData;
};  

console.log(JSON.stringify(generateSeedData().friendLikes, null, 3));

// Add a raw query to reset sequence


// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       // Inserts seed entries
//       for (let i = 0; i < )


//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };


// {
//       user_id: faker.random.number({ min: 1, max: 100000 }),
//       username: faker.internet.userName(),
//       profile_img_url: faker.image.imageUrl(),
//       img_url: faker.image.imageUrl(),
//       caption: faker.lorem.sentence(),
//       location: faker.address.city(),
//       like_count: faker.random.number({ min: 1, max: 200 }),
//     };