@component('mail::message')
# Hi {{ $details['name'] }}!

You are receiving this email because you have just requested to reset your password.
<br><br>
Click the button to reset your password or alternatively.

@component('mail::button', ['url' => $details['url']])
Reset Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
