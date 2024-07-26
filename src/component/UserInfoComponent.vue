<template>
  <div class="container">
    <header>
      <div class="logo">
        <img src="../assets/vue.svg" />
      </div>
      <div class="user-menu">
        <button class="avatar">{{ userInfo.name ? userInfo.name.substring(0, 1) : '' }}</button>
      </div>
    </header>

    <main>
      <div class="info">
        <div class="personal-info">
          <h1>
            个人信息
            <span v-if="!isEditing" @click="startEditing" class="edit-btn">[编辑]</span>
            <span v-else class="edit-actions">
              <span @click="cancelEditing" class="edit-btn">取消</span>
              <span @click="saveChanges" class="edit-btn">保存</span>
            </span>
          </h1>
        </div>
        <div class="info-grid">
          <div class="info-section">
            <h2>基本信息</h2>

            <div class="info-item">
              <span>姓名</span>
              <div v-if="!isEditing">{{ userInfo.name }}</div>
              <div v-else class="input-container">
                <input v-model="editedInfo.name" @input="validateName" type="text" />
                <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
              </div>
            </div>

            <div class="info-item">
              <span>出生日期</span>
              <div v-if="!isEditing">{{ userInfo.birth_day }}</div>
              <div v-else class="input-container">
                <input v-model="editedInfo.birth_day" @input="validateBirthDay" type="date" />
                <p v-if="errors.name" class="error-message">{{ errors.birth_day }}</p>
              </div>
            </div>

            <div class="info-item">
              <span>性别</span>
              <div v-if="!isEditing">{{ userInfo.gender === 0 ? '男' : '女' }}</div>
              <div v-else class="radio-group">
                <label>
                  <input type="radio" v-model.number="editedInfo.gender" :value="0" />
                  男
                </label>
                <label>
                  <input type="radio" v-model.number="editedInfo.gender" :value="1" />
                  女
                </label>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>联系信息</h2>
            <div class="info-item">
              <span>邮件地址</span>
              <div v-if="!isEditing">{{ userInfo.email }}</div>
              <div v-else class="input-container">
                <input v-model="editedInfo.email" @input="validateEmail" type="email" />
                <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
              </div>
            </div>

            <div class="info-item">
              <span>电话</span>
              <div v-if="!isEditing">{{ userInfo.phone }}</div>
              <div v-else class="input-container">
                <input v-model="editedInfo.phone" @input="validatePhone" type="tel" />
                <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h2>地址信息</h2>
            <div class="info-item">
              <span>家庭地址</span>
              <div v-if="!isEditing">{{ userInfo.home_address }}</div>
              <input v-else v-model="editedInfo.home_address" type="text" />
            </div>
            <div class="info-item">
              <span>工作地址</span>
              <div v-if="!isEditing">{{ userInfo.work_address }}</div>
              <input v-else v-model="editedInfo.work_address" type="text" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      editedInfo: {},
      loading: true,
      errors: {},
      activeLink: 'personal',
      isEditing: false,
    };
  },
  methods: {
    async fetchUserInfo() {
      try {
        const response = await fetch('/api/user/info/1');
        const data = await response.json();
        if (data.state !== 'ok') {
          throw new Error(data.msg);
        }
        this.userInfo = data.data;
      } catch (err) {
        console.error(err.msg);
      } finally {
        this.loading = false;
      }
    },
    startEditing() {
      this.editedInfo = { ...this.userInfo };
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.errors = {};
    },
    validateName() {
      if (!this.editedInfo.name) {
        this.errors.name = '姓名是必填项。';
      } else if (this.editedInfo.name.length > 64) {
        this.errors.name = '姓名不能超过64个字符。';
      } else {
        delete this.errors.name;
      }
    },
    validateBirthDay() {
      if (!this.editedInfo.birth_day) {
        this.errors.birth_day = '出生日期是必填项。';
      } else {
        const birthDay = new Date(this.editedInfo.birth_day);
        const today = new Date();
        if (birthDay >= today) {
          this.errors.birth_day = '出生日期必须是过去的日期。';
        } else {
          console.log(this.errors);
          delete this.errors.birth_day;
        }
      }
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.editedInfo.email)) {
        console.log(this.errors);
        this.errors.email = '邮件地址格式错误';
      } else {
        delete this.errors.email;
      }
    },
    validatePhone() {
      const phonePatterh = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
      if (!phonePatterh.test(this.editedInfo.phone)) {
        this.errors.phone = '手机号码格式错误';
      } else {
        delete this.errors.phone;
      }
    },

    async saveChanges() {
      try {
        if (Object.keys(this.errors).length != 0) {
          return;
        }
        const response = await fetch('/api/user/update/1', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editedInfo),
        });
        if (!response.ok) {
          throw new Error('Failed to update user info');
        }
        const data = await response.json();
        if (data.state !== 'ok') {
          throw new Error(data.msg);
        }
        await this.fetchUserInfo();
        this.isEditing = false;
      } catch (err) {
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchUserInfo();
  },
};
</script>
<style scoped>
.container {
  font-family: 'Inter', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  /* height:; */
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

main {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
}

.personal-info {
  position: relative;
}

.edit-btn {
  font-size: 0.6em;
  color: gray;
  text-decoration: underline;
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.edit-actions {
  display: inline;
}
.error-message {
  top: 0;
  color: red;
  font-size: 12px;
}

.info {
  width: 80%;
}

.info-grid {
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.info-section h2 {
  display: inline-grid;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.info-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.info-item span {
  color: #6b7280;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-group input[type='radio'] {
  margin-right: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  main {
    display: flex;
    flex-direction: column;
  }

  nav {
    display: flex;
    width: 100%;
    height: 2em;
    flex-direction: row;
    /* position: fixed; */
    margin-bottom: 1rem;
  }

  .nav-link {
    display: flex;
    flex-direction: row;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    color: #1f2937;
    text-decoration: none;
  }

  .nav-link:hover {
    background-color: #f3f4f6;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
