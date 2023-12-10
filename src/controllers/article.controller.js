import Article from '../models/article.model.js';
import User from '../models/user.model.js';

export const getArticles = async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const articles = await Article.find()
         .populate({ path: 'owner', select: 'fullName email age' })
         .limit(limit)
         .skip((page - 1) * limit)
         .sort({ createdAt: -1 });
      const count = await User.countDocuments();

      return res.json({
         articles,
         totalPages: Math.ceil(count / limit),
         currentPage: page,
      });
   } catch (err) {
      next(err);
   }
};

export const getArticleById = async (req, res, next) => {
   try {
      const article = await Article.findById(req.params.id).populate({
         path: 'owner',
         select: 'fullName email age',
      });
      if (!article) {
         return res.status(404).json({ message: 'Article not found' });
      }
      res.status(200).json(article);
   } catch (err) {
      next(err);
   }
};

export const createArticle = async (req, res, next) => {
   try {
      const body = req.body;
      const user = await User.findById(body.owner);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      await Article.create(body);
      user.numberOfArticles += 1;
      await user.save();
      res.sendStatus(204);
   } catch (err) {
      next(err);
   }
};

export const updateArticleById = async (req, res, next) => {
   try {
      const { title, subtitle, description, category } = req.body;
      const article = await Article.findById(req.params.id);

      if (!article) {
         return res.status(404).json({ message: 'Article not found' });
      }

      article.title = title;
      article.subtitle = subtitle;
      article.description = description;
      article.category = category;

      await article.save();
      res.sendStatus(204);
   } catch (err) {
      next(err);
   }
};

export const deleteArticleById = async (req, res, next) => {
   try {
      const articleId = req.params.id;
      const article = await Article.findByIdAndDelete(articleId);
      if (!article) {
         return res.status(404).json({ message: 'Article not found' });
      }
      const user = await User.findById(article.owner);
      user.numberOfArticles -= 1;
      await user.save();
      res.sendStatus(204);
   } catch (err) {
      next(err);
   }
};
