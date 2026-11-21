<?php

return [
    'array' => ':attribute harus berupa daftar.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Kata sandi saat ini salah.',
    'distinct' => ':attribute memiliki nilai duplikat.',
    'email' => ':attribute harus berupa alamat email yang valid.',
    'enum' => ':attribute yang dipilih tidak valid.',
    'exists' => ':attribute yang dipilih tidak valid.',
    'file' => ':attribute harus berupa file.',
    'integer' => ':attribute harus berupa bilangan bulat.',
    'lowercase' => ':attribute harus berupa huruf kecil.',
    'max' => [
        'array' => ':attribute maksimal :max item.',
        'file' => ':attribute maksimal :max KB.',
        'numeric' => ':attribute maksimal :max.',
        'string' => ':attribute maksimal :max karakter.',
    ],
    'mimes' => ':attribute harus berupa file dengan tipe: :values.',
    'mimetypes' => ':attribute harus berupa file dengan tipe: :values.',
    'min' => [
        'array' => ':attribute minimal :min item.',
        'file' => ':attribute minimal :min KB.',
        'numeric' => ':attribute minimal :min.',
        'string' => ':attribute minimal :min karakter.',
    ],
    'required' => ':attribute wajib diisi.',
    'string' => ':attribute harus berupa teks.',
    'unique' => ':attribute sudah digunakan.',
    'uploaded' => ':attribute gagal diunggah.',

    'password' => [
        'letters' => ':attribute harus mengandung minimal satu huruf.',
        'mixed' => ':attribute harus mengandung huruf besar dan huruf kecil.',
        'numbers' => ':attribute harus mengandung minimal satu angka.',
        'symbols' => ':attribute harus mengandung minimal satu simbol.',
        'uncompromised' => ':attribute yang dimasukkan pernah bocor di internet. Pilih :attribute yang berbeda.',
    ],

    'attributes' => [
        'name' => 'Nama',
        'email' => 'Email',
        'password' => 'Kata sandi',
        'password_confirmation' => 'Konfirmasi kata sandi',
        'current_password' => 'Kata sandi saat ini',
    ],
];
