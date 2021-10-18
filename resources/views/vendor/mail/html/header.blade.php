<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
@elseif (trim($slot) === 'UMBRELLAPROJECT')
<img src="{{URL::asset('/images/email-header-umbrella project.jpg')}}" class="logo" alt="">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
