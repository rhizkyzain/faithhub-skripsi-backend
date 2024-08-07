const express = require("express");
const authController = require("../../modules/user/user");
const doubtController = require("../../modules/question/question");
const upload = require("../../config/multer.js");


const router = express.Router();
router.route("/create").post(authController.authMiddleware, doubtController.createQuestion);
router.route("/update/:questionId").put(authController.authMiddleware, doubtController.editQuestion);
router.route("/delete/:questionId").delete(authController.authMiddleware, doubtController.deleteQuestion);
router.route("/reply/:questionId").post(authController.authMiddleware, doubtController.addReply);
router.route("/vote/:questionId").post(authController.authMiddleware, doubtController.vote);
router.route("/fetchAll").get(authController.authMiddleware, doubtController.getAllQuestion);
router.route("/getQuestionbyTags").post(authController.authMiddleware ,doubtController.getQuestionbyTags); 
router.route("/getUserQuestion").get(authController.authMiddleware ,doubtController.getUserQuestion); 
router.route("/getDetail/:questionId").get(authController.authMiddleware, doubtController.getQuestionDetail);
router.route("/sortReplies/:questionId").post(authController.authMiddleware, doubtController.sortReplies);
router.route("/getTags").get(authController.authMiddleware ,doubtController.getTags); 
router.route("/getAllTags").get(authController.authMiddleware ,doubtController.getAllTags); 
router.route("/searchContent").get(authController.authMiddleware ,doubtController.searchContent); 
router.route("/uploadAudio").post(authController.authMiddleware, upload.single('audio'), doubtController.uploadAudio);
router.route("/getAudioContent").get(authController.authMiddleware ,doubtController.getAudio); 
router.route("/getTotalContent").get( doubtController.getTotalContent); 
router.route("/deleteAudio/:audioId").delete(authController.authMiddleware, doubtController.deleteAudio);

module.exports = router;