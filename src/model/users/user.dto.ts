export interface UserCreateDto {
  userName: string;
  email: string;
  passWord: string;
}

export interface SignInUserDto {
    userName?: string;
    email?: string;
    passWord: string;
}