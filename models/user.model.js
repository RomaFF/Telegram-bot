const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    TelegramId: {
        type: Number,
        required: true
    },
    FIO: {
        type: String,
        required: true
    },
    Group: {
        type: String,
        required: true
    }, 
    Phone_number: {
        type: Number,
        required: true
    }
});
mongoose.model("User", UserSchema);

const TestSchema = new Schema ({
  TelegramId: {
      type: Number,
      required: true
  },
  testName: {
      type: String,
      required: true
  },
  testFor: {
      type: String,
      required: true
  }, 
  testReply: {
      type: String,
      required: true
  },
  testStruct: {
    type: String,
    required: true
  }
});
mongoose.model("Test", TestSchema);

const TUserSchema = new Schema ({
  TelegramId: {
      type: Number,
      required: true
  },
  FIO: {
      type: String,
      required: true
  }, 
  Phone_number: {
      type: Number,
      required: true
  }
});
mongoose.model("TUser", TUserSchema);

const TestResultsSchema = new Schema ({
  TelegramId: {
      type: Number,
      required: true
  },
  FIO: {
      type: String,
      required: true
  },
  teacher_TelegramID: {
      type: String,
      required: true
  },
  testName: {
      type: String,
      required: true
  }, 
  testResult: {
      type: String,
      required: true
  },
  Group: {
    type: String,
    required: true
  }
});
mongoose.model("TestResult", TestResultsSchema);