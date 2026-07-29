<template>
    <div class="relative min-h-screen">
        <PlexusBackground/>

        <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-[380px] rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                <div class="mb-8 text-center">
                    <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
                        <BrainLogo icon-class="w-9 h-9 text-white"/>
                    </div>
                    <h1 class="mb-1 text-2xl font-bold text-slate-800">大卡鹰眼</h1>
                    <p class="text-sm text-slate-400">物流决策分析智能体</p>
                </div>

                <form class="space-y-5" @submit="doLogin">
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-slate-700">手机号</label> <Input v-model="form.phone" type="tel" autocomplete="tel" placeholder="请输入手机号" class="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"/>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-slate-700">密码</label>
                        <div class="relative">
                            <Input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" class="h-11 border-slate-200 pr-10 focus:border-blue-500 focus:ring-blue-500/20"/>
                            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="切换密码可见" @click="togglePasswordVisibility">
                                <EyeOff v-if="showPassword" class="h-4 w-4" />
                                <Eye v-else class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium text-slate-700">验证码</label>
                        <div class="flex">
                            <Input v-model="form.captcha" type="text" placeholder="请输入验证码" class="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 flex-1"/>
                            <img :src="captchaImage" alt="验证码" class="h-11 w-auto cursor-pointer ml-2" @click="refreshCaptcha"/>
                        </div>

                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <label class="flex cursor-pointer items-center gap-2"> <input type="checkbox" v-model="keepMe" class="h-4 w-4 rounded border-slate-300 text-blue-600"/> <span class="text-slate-600">记住我</span> </label>
                        <button type="button" class="text-blue-600 hover:text-blue-700" @click="openForgotPassword">
                            忘记密码？
                        </button>
                    </div>

                    <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {{ error }}
                    </div>

                    <Button type="submit" class="h-11 w-full bg-gradient-to-r from-blue-600 to-cyan-500 font-medium text-white hover:from-blue-700 hover:to-cyan-600" :disabled="isLoading">
                        {{ isLoading ? '登录中...' : '登 录' }}
                    </Button>
                </form>

                <div class="mt-6 border-t border-slate-100 pt-4 text-center">
                    <p class="text-xs text-slate-400">请使用注册手机号登录</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 全屏忘记密码弹窗 -->
    <div v-if="forgotOpen" class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
        <div class="w-full max-w-md">
            <Card class="relative">
                <button type="button" class="absolute right-3 top-3 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="关闭忘记密码弹窗" @click="closeForgotPassword">
                    <X class="h-4 w-4"/>
                </button>
                <CardHeader class="text-center">
                    <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Key class="h-6 w-6 text-white"/>
                    </div>
                    <CardTitle class="text-xl">忘记密码</CardTitle>
                    <p class="mt-1 text-sm text-slate-500">请输入您的邮箱和手机号进行验证</p>
                </CardHeader>
                <CardContent>
                    <!-- 成功态 -->
                    <div v-if="forgotSuccess" class="pt-2 text-center">
                        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle class="h-8 w-8 text-green-600"/>
                        </div>
                        <h2 class="mb-2 text-xl font-semibold text-slate-800">密码重置成功</h2>
                        <p class="mb-4 text-slate-500">新密码已发送至您的邮箱，请查收</p>
                        <p class="text-xs text-slate-400">3秒后自动返回登录页面...</p>
                    </div>

                    <!-- 表单态 -->
                    <form v-else @submit.prevent="submitForgotPassword" class="space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium"> 注册邮箱 <span class="text-red-500">*</span> </label>
                            <div class="relative">
                                <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                                <Input type="email" placeholder="请输入注册邮箱" v-model="forgotForm.email" class="pl-10"/>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium"> 注册手机号 <span class="text-red-500">*</span> </label>
                            <div class="relative">
                                <Phone class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
                                <Input type="tel" placeholder="请输入注册手机号" v-model="forgotForm.phone" class="pl-10"/>
                            </div>
                        </div>

                        <div v-if="forgotError" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {{ forgotError }}
                        </div>

                        <Button type="submit" :disabled="forgotLoading" class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            {{ forgotLoading ? '验证中...' : '提交验证' }}
                        </Button>

                        <div class="mt-6 rounded-lg bg-blue-50 p-4 text-sm">
                            <p class="text-xs text-blue-600">
                                <strong>说明：</strong>验证通过后，系统将自动重置您的密码并发送至注册邮箱，请使用新密码登录。 </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script>
    import {Eye, EyeOff, Key, Mail, Phone, CheckCircle, X} from 'lucide-vue-next';
    import {Button} from '@/components/ui/button';
    import {Input} from '@/components/ui/input';
    import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
    import PlexusBackground from '@/components/login/PlexusBackground.vue';
    import BrainLogo from '@/components/login/BrainLogo.vue';
    import {userApi} from '@/services/user/api.js';
    import {userHelpers} from "@/services/user/helpers.js";
    import {useUserStore} from "@/store/user.js";
    import {AUTH_TOKEN_KEY} from "@/services/http.js";

    export default {
        name: 'Login',
        setup(){
            return {
                userStore: useUserStore(),
            };
        },
        components: {PlexusBackground, BrainLogo, Button, Input, Card, CardContent, CardHeader, CardTitle, Eye, EyeOff, Key, Mail, Phone, CheckCircle, X},
        data() {
            return {
                captchaImage: '',
                form: {
                    phone: '',
                    password: '',
                    captcha: '',
                    captchaId: '',
                },
                showPassword: false,
                error: '',
                isLoading: false,
                forgotOpen: false,
                keepMe:false,
                forgotForm: {
                    email: '',
                    phone: '',
                },
                forgotError: '',
                forgotSuccess: false,
                forgotLoading: false,
            };
        },
        mounted() {
            if (import.meta.env.MODE === 'development') {
                this.form.phone = '18601946029';
                this.form.password = 'F2eI13ML2zN5';
            }
            this.refreshCaptcha();
        },
        methods: {
            refreshCaptcha(){
                userApi.getCaptcha().then(res => {
                    this.form.captchaId = res.headers['x-captcha-uuid'];
                    this.captchaImage = URL.createObjectURL(res.data);
                    this.form.captcha = '';
                }).catch(e=>{
                    console.log(e);
                });
            },
            togglePasswordVisibility() {
                this.showPassword = !this.showPassword;
            },

            openForgotPassword() {
                this.forgotOpen = true;
                this.forgotSuccess = false;
                this.forgotError = '';
                this.forgotLoading = false;
                this.forgotForm = {email: '', phone: ''};
            },

            closeForgotPassword() {
                this.forgotOpen = false;
            },

            async submitForgotPassword(e) {
                e.preventDefault();
                this.forgotError = '';
                this.forgotLoading = true;
                this.forgotSuccess = false;

                const email = this.forgotForm.email.trim();
                const phone = this.forgotForm.phone.trim();

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    this.forgotError = '请输入正确的邮箱地址';
                    this.forgotLoading = false;
                    return;
                }

                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(phone)) {
                    this.forgotError = '请输入正确的手机号';
                    this.forgotLoading = false;
                    return;
                }

                try {
                    await userApi.resetPassword({phone, email});
                    this.forgotSuccess = true;
                    setTimeout(() => {
                        this.closeForgotPassword();
                    }, 3000);
                } catch (err) {
                    this.forgotError = typeof err === 'string' ? err : '提交失败，请稍后重试';
                } finally {
                    this.forgotLoading = false;
                }
            },

            async doLogin(e) {
                e.preventDefault();
                this.error = '';
                const p = this.form.phone.trim();

                if (!p || !this.form.password) {
                    this.error = '请输入手机号和密码';
                    return;
                }

                const phoneRegex = /^1[3-9]\d{9}$/;
                if (!phoneRegex.test(p)) {
                    this.error = '请输入正确的手机号';
                    return;
                }
                if (!this.form.captcha) {
                    this.error = '请输入验证码';
                    return;
                }

                this.isLoading = true;

                try {
                    const {data} = await userApi.login(this.form);
                    console.log(data);
                    if(data.code === 0) {
                        let token = data.data;
                        localStorage.setItem(AUTH_TOKEN_KEY, token);
                        this.userStore.isLogin = true;
                        if (this.keepMe) {
                            // TODO 记住我
                        }
                        this.$router.push({path:'/'}).then(r=>{
                            console.log(r);
                        }).catch((e)=>{
                            console.log(e);
                        });
                    }else{
                        this.error = data.message;
                        this.refreshCaptcha();
                    }
                } catch (err) {
                    console.log(err);
                    this.error = typeof err === 'string' ? err : '登录失败，请稍后重试';
                } finally {
                    this.isLoading = false;
                }
            },
        },
    };
</script>
