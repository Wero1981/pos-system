import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import AuthServices from '../../../services/AuthServices';


function LoginWithGoogle() {
    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await AuthServices.loginWithGoogle(tokenResponse.access_token);
                console.log("[DEBUG] Login exitoso", res);
            } catch (error) {
                console.error("[DEBUG] Error en login con Google:", error);
            }
        },
        onError: errorResponse => {
            console.error("[DEBUG] Error en login con Google:", errorResponse);
        }
    });

    return (
        <div>
            <button onClick={() => login()} className="btn btn-danger mt-3">
                Iniciar sesión con Google
            </button>
        </div>
    );
}
export default LoginWithGoogle;
