import os
import unittest
from recruitment_bot import RecruitmentBot

class TestRecruitmentBot(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bot_token = os.getenv("BOT_TOKEN")
        cls.recruitment_bot = RecruitmentBot(cls.bot_token)
        cls.positive_candidate = {"skills": ["Python", "Django"], "experience": 5}
        cls.negative_candidate = {"skills": ["Basic Excel"], "experience": 1}

    def test_positive_candidate_filtering(self):
        self.assertTrue(self.recruitment_bot.filter_candidate(self.positive_candidate))

    def test_negative_candidate_filtering(self):
        self.assertFalse(self.recruitment_bot.filter_candidate(self.negative_candidate))

    def test_welcome_message_is_correct(self):
        message = self.recruitment_bot.generate_welcome_message()
        self.assertIn("Welcome", message)

    def test_rejection_message_for_unsuitable_candidate(self):
        message = self.recruitment_bot.generate_response(self.negative_candidate)
        self.assertIn("not fit", message)

    def test_filter_candidate_with_invalid_format_raises_error(self):
        invalid_candidate_format = "Not a valid dictionary"
        with self.assertRaises(ValueError):
            self.recruitment_bot.filter_candidate(invalid_candidate_filter)

    def test_error_when_bot_token_is_none(self):
        bot_with_no_token = RecruitmentBot(None)
        with self.assertRaises(RuntimeError):
            bot_with_no_token.some_bot_action()

    def test_bot_token_is_loaded(self):
        self.assertIsNotNone(self.bot_token)

    def test_external_api_rate_limit(self):
        for _ in range(100):
            response = self.recruitment_bot.make_external_api_call()
        self.assertNotEqual(response, "Rate limit exceeded")

if __name__ == '__main__':
    unittest.main()