@component('mail::message')
# Hi {{ $details['name'] }}!

Your 2FA code for login is as follows
<br><br>
{{ $details['code'] }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
