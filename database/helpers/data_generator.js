const faker = require('faker');
const { knex } = require('../bookshelf');


const createPosts = () => {
  const posts = [];

  for (let i = 0; i < 10000; i++) {
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


const createFeeds = () => {
  const startTime = Date.now();

  const postFeeds = [];
  const friendLikes = [];

  for (let userId = 1; userId < 101; userId += 1) {
    const feed = [];
    const feedLength = faker.random.number({ min: 500, max: 3500 });

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
        friend_likes: friends,
      });
    }

    postFeeds.push({ user_id: userId, posts_feed: feed });

  }
  console.log(`Finished in ${Date.now() - startTime} milliseconds`);
  return { postFeed: postFeeds[0], friendLikes: friendLikes[0] };

};


module.exports.createPosts = createPosts;
module.exports.createFeeds = createFeeds;


//   new Post({
//     user_id: 1,
//     username: 'FredZ',
//     profile_img_url: 'https://storage.model-ig.com/93838djjj39303jdj',
//     img_url: 'https://storage.model-ig.com/03839jdjje88ud',
//     caption: 'HRSF83 is easily the most talented cohort we\'ve ever had',
//     location: 'San Francisco, CA',
//     like_count: 92,
//   }).save()
//     .then((saved) => {
//       console.log('saved:', saved);
//       res.send(saved);
//     })
//     .catch(error => console.log('error!', error
