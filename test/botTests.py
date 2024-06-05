import unittest
from recruitment_bot import RecruitmentBot
import os


class TestRecruitmentBot(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bot_token = os.getenv("BOT_TOKEN")
        cls.recruitment_bot = RecruitmentBot(cls.bot_token)
        cls.candidate_positive = {"skills": ["Python", "Django"], "experience": 5}
        cls.candidate_negative = {"skills": ["Basic Excel"], "experience": 1}

    def test_candidate_filtering_positive(self):
        self.assertTrue(self.recruitment_bot.filter_candidate(self.candidate_positive))

    def test_candidate_filtering_negative(self):
        self.assertFalse(self.recruitment_bot.filter_candidate(self.candidate_negative))

    def test_interaction_automation_welcome(self):
        message = self.recruitment_bot.generate_welcome_message()
        self.assertIn("Welcome", message)

    def test_interaction_automation_rejection(self):
        message = self.recruitment_bot.generate_response(self.candidate_negative)
        self.assertIn("not fit", message)

    def test_error_handling_invalid_candidate_format(self):
        candidate = "Not a valid dictionary"
        with self.assertRaises(ValueError):
            self.recruitment_bot.filter_candidate(candidate)

    def test_error_handling_bot_token(self):
        failed_bot = RecruitmentBot(None)
        with self.assertRaises(RuntimeError):
            failed_bot.some_bot_action()

    def test_environment_variables_loading(self):
        self.assertIsNotNone(self.bot_token)

    def test_api_rate_limit_handling(self):
        for _ in range(100):
            response = self.recruitment_bot.make_external_api_call()
        self.assertNotEqual(response, "Rate limit exceeded")


if __name__ == '__main__':
    unittest.main()