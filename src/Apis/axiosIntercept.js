import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
})
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.url === '/auth' || response.config.url === '/reload' ) {
            console.log(response)
            const accessToken = response.data.accessToken;
            axiosInstance.defaults.headers.common['Authorization'] = accessToken
        }
        return response;
    },
    (error) => {
        console.log(error)
        if (error.response.status === 401 && !error.config._retry) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/refresh`, { withCredentials: true }).
                then((res) => {
                    axiosInstance.defaults.headers.common['Authorization'] = res.data
                }).catch((err) => {
                    window.location.href = "/";
                    return Promise.reject(error);
                })
        } else {
            return Promise.reject(error);
        }
    }
);
