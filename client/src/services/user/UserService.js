import axios from '../../axios';
import authHeader from '../authenticity/auth-header';

class UserService {
  getPublicContent() {
    return axios.get('all');
  }

  getStudentBoard() {
   
    return axios.get('/student', { headers: authHeader()});
  }

  getTeacherBoard() {

    return axios.get('/teacher', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get('/admin', { headers: authHeader() });
  }
 }


export default new UserService();