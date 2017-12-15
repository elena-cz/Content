const faker = require('faker');
const { knex } = require('../bookshelf');


const createPosts = () => {
  const posts = [];

  for (let i = 0; i < 10000; i += 1) {
    const post = {
      user_id: faker.random.number({ min: 1, max: 100000 }),
      username: faker.internet.userName(),
      profile_img_url: faker.image.imageUrl(),
      img_url: faker.image.imageUrl(),
      caption: faker.lorem.sentence(),
      location: faker.address.city(),
      like_count: faker.random.number({ min: 1, max: 200 }),
    };
    posts.push(post);
  }

  knex.batchInsert('posts', posts, 1000)
    .catch(error => console.log('error!', error));
};


const createFeeds = (startUserId = 0) => {
  const startTime = Date.now();
  let userId = startUserId * 1;

  const postFeeds = [];
  const friendLikes = [];

  // For each user, create their post feed
  for (let k = 0; k < 500; k++) {
    userId += 1;
    const feed = [];
    const feedLength = faker.random.number({ min: 100, max: 200 });

    for (let i = 0; i < feedLength; i += 1) {
      // Generate postID that is among the most recent 1 million posts
      // Older posts are toward the beginning of array (sorted)
      const increment = 1000000 / feedLength;
      const postId = faker.random.number({ min: (i * increment) + 1, max: (i + 1) * increment }) + 9000000;

      // Add post_id to user's feed
      feed.push(postId);

      // Generate friend likes for userId/postId combo
      const friends = [];
      const friendsLength = faker.random.number({ min: 1, max: 20 });
      for (let j = 0; j < friendsLength; j += 1) {
        friends.push({
          user_id: faker.random.number({ min: 1, max: 100000 }),
          username: faker.internet.userName(),
        });
      }
      friendLikes.push({
        user_id: userId,
        post_id: postId,
        friend_likes: JSON.stringify(friends),
      });
    }

    postFeeds.push({ user_id: userId, post_feed: JSON.stringify(feed) });
  }
  const generationTime = Date.now() - startTime;
  console.log(`Finished generating data in ${generationTime} milliseconds`);

  // Save to database
  knex.batchInsert('feeds', postFeeds, 1000)
    .then(() => knex.batchInsert('friend_likes', friendLikes, 1000))
    .then(() => {
      console.log(`Finished saving data in ${Date.now() - generationTime} milliseconds`);
      console.log('userId', userId);
      // if (userId < 49501) {
      //   return createFeeds(userId);
      // }
    })
    .catch(error => console.log('error!', error));
};


  // return { postFeed: postFeeds[0], friendLikes: friendLikes[0] };


module.exports.createPosts = createPosts;
module.exports.createFeeds = createFeeds;

