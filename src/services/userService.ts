import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://31.220.81.177';

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('drampa_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
  }) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async updateProfileImage(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/profile/image`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update profile image error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile image');
    }
  }

  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/password`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }

  async updatePreferences(preferences: any) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/preferences`,
        { preferences },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update preferences error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  }

  async getCredits() {
    try {
      const response = await axios.get(`${API_URL}/api/users/credits`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Get credits error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch credits');
    }
  }

  async addCredits(amount: number) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/credits/add`,
        { amount },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Add credits error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add credits');
    }
  }
}

export default new UserService();