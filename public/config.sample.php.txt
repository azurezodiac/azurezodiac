<?php
/**
 * Copy this file to config.php inside public_html/api/ and fill cPanel MySQL values.
 * Never commit real passwords.
 */
return [
  'db_host' => 'localhost',
  'db_name' => 'your_cpanel_db_name',
  'db_user' => 'your_cpanel_db_user',
  'db_pass' => 'your_cpanel_db_password',
  'admin_password' => 'change-me-admin-password',
  'admin_session_secret' => 'change-me-long-random-secret',
];
