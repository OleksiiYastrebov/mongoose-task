import User from '../models/user.model.js';
import Article from '../models/article.model.js';

export const getUsers = async (req, res, next) => {
   try {
      let users;
      const sortType = req.query.sort;
      if (sortType) {
         users = await User.find({})
            .sort({ age: sortType })
            .select('id fullName email age');
      } else {
         users = await User.find({}).select('id fullName email age');
      }
      res.json(users);
   } catch (err) {
      next(err);
   }
};

export const getUserByIdWithArticles = async (req, res, next) => {
   try {
      const id = req.params.id;
      const user = await User.findById(id).exec();
      const articles = await Article.find({ owner: id }).select(
         'title subtitle createdAt'
      );
      await res.json({ user, articles });
   } catch (err) {
      next(err);
   }
};

export const createUser = async (req, res, next) => {
   try {
      await User.create(req.body);
      res.sendStatus(204);
   } catch (err) {
      next(err);
   }
};

export const updateUserById = async (req, res, next) => {
   try {
      const param = req.params.id;
      const { firstName, lastName, age } = req.body;
      if (!firstName || !lastName || !age) {
         return res.status(400).json({
            message: 'Body missing at least one of these field: firstName, lastName, age',
         });
      }
      await User.findByIdAndUpdate(param, {
         firstName,
         lastName,
         age,
         fullName: `${firstName} ${lastName}`,
      });
      res.sendStatus(204);
   } catch (err) {
      next(err);
   }
};

export const deleteUserById = async (req, res, next) => {
   try {
      const userId = req.params.id;
      const deletedUser = await User.deleteOne({ _id: userId });
      if (!deletedUser) {
         res.status(404).json({ message: 'No such user' });
      } else {
         await Article.deleteMany({ owner: userId });
         res.sendStatus(204);
      }
   } catch (err) {
      next(err);
   }
};
